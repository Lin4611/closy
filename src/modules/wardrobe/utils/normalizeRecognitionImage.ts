export type NormalizeRecognitionImageOptions = {
  fileName?: string
  fileNamePrefix?: string
  maxDimension?: number
  mimeType?: 'image/jpeg'
  quality?: number
}

const DEFAULT_MAX_DIMENSION = 1600
const DEFAULT_MIME_TYPE = 'image/jpeg'
const DEFAULT_QUALITY = 0.9

const loadImageElement = async (file: File) => {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image()

      nextImage.onload = () => resolve(nextImage)
      nextImage.onerror = () => reject(new Error('無法讀取圖片內容'))
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

export const normalizeRecognitionImage = async (
  file: File,
  options: NormalizeRecognitionImageOptions = {}
) => {
  const image = await loadImageElement(file)
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height

  if (!width || !height) {
    throw new Error('無法取得圖片尺寸')
  }

  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION
  const mimeType = options.mimeType ?? DEFAULT_MIME_TYPE
  const quality = options.quality ?? DEFAULT_QUALITY
  const targetSize = resolveTargetSize(width, height, maxDimension)

  const canvas = document.createElement('canvas')
  canvas.width = targetSize.width
  canvas.height = targetSize.height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('無法建立圖片處理畫布')
  }

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
