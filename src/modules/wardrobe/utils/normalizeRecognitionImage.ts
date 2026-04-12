export type NormalizeRecognitionImageOptions = {
  fileName?: string
  fileNamePrefix?: string
  maxDimension?: number
  mimeType?: 'image/jpeg'
  quality?: number
}

export const SUPPORTED_RECOGNITION_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const

export const SUPPORTED_RECOGNITION_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
] as const

export const SUPPORTED_RECOGNITION_IMAGE_FORMAT_TEXT = 'jpg、png、webp、avif'

export const SUPPORTED_RECOGNITION_IMAGE_ACCEPT = [
  ...SUPPORTED_RECOGNITION_IMAGE_TYPES,
  ...SUPPORTED_RECOGNITION_IMAGE_EXTENSIONS,
].join(',')

export const DEFAULT_RECOGNITION_IMAGE_MAX_DIMENSION = 1600
export const DEFAULT_RECOGNITION_IMAGE_MIME_TYPE = 'image/jpeg'
export const DEFAULT_RECOGNITION_IMAGE_QUALITY = 0.9

const loadImageElement = async (file: File) => {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image()

      nextImage.onload = () => resolve(nextImage)
      nextImage.onerror = () => reject(new Error('目前無法讀取這張圖片，請改用其他照片或格式'))
      nextImage.src = objectUrl
    })

    if (typeof image.decode === 'function') {
      await image.decode().catch(() => undefined)
    }

    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

const resolveOutputName = (file: File, options: NormalizeRecognitionImageOptions) => {
  if (options.fileName) {
    return options.fileName
  }

  if (options.fileNamePrefix) {
    return `${options.fileNamePrefix}-${Date.now()}.jpg`
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'closy-recognition'
  return `${baseName}.jpg`
}

const resolveTargetSize = (width: number, height: number, maxDimension: number) => {
  const longestSide = Math.max(width, height)

  if (longestSide <= maxDimension) {
    return { width, height }
  }

  const scale = maxDimension / longestSide
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

const hasSupportedRecognitionImageType = (file: File) =>
  SUPPORTED_RECOGNITION_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_RECOGNITION_IMAGE_TYPES)[number])

const hasSupportedRecognitionImageExtension = (file: File) => {
  const lowerName = file.name.toLowerCase()
  return SUPPORTED_RECOGNITION_IMAGE_EXTENSIONS.some((extension) => lowerName.endsWith(extension))
}

export const isSupportedRecognitionImageFile = (file: File) =>
  hasSupportedRecognitionImageType(file) || hasSupportedRecognitionImageExtension(file)

const validateRecognitionImageFile = (file: File) => {
  if (!(file instanceof File)) {
    throw new Error('找不到可處理的圖片檔案')
  }

  if (file.size <= 0) {
    throw new Error('圖片內容為空，請重新選擇照片')
  }

  if (!isSupportedRecognitionImageFile(file)) {
    throw new Error(`請選擇 ${SUPPORTED_RECOGNITION_IMAGE_FORMAT_TEXT} 圖片`)
  }
}

export const normalizeRecognitionImage = async (
  file: File,
  options: NormalizeRecognitionImageOptions = {}
) => {
  validateRecognitionImageFile(file)

  const image = await loadImageElement(file)
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height

  if (!width || !height) {
    throw new Error('無法取得圖片尺寸')
  }

  const maxDimension = options.maxDimension ?? DEFAULT_RECOGNITION_IMAGE_MAX_DIMENSION
  const mimeType = options.mimeType ?? DEFAULT_RECOGNITION_IMAGE_MIME_TYPE
  const quality = options.quality ?? DEFAULT_RECOGNITION_IMAGE_QUALITY
  const targetSize = resolveTargetSize(width, height, maxDimension)

  const canvas = document.createElement('canvas')
  canvas.width = targetSize.width
  canvas.height = targetSize.height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('無法建立圖片處理畫布')
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, 0, 0, targetSize.width, targetSize.height)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality)
  })

  if (!blob) {
    throw new Error('圖片處理失敗，請重新嘗試')
  }

  return new File([blob], resolveOutputName(file, options), {
    type: mimeType,
    lastModified: Date.now(),
  })
}
