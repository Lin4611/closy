type CaptureVideoFrameOptions = {
  fileName?: string
  mimeType?: 'image/jpeg' | 'image/png'
  quality?: number
  maxDimension?: number
}

const resolveTargetSize = (width: number, height: number, maxDimension?: number) => {
  if (!maxDimension || maxDimension <= 0) {
    return { width, height }
  }

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

export const captureVideoFrame = async (
  video: HTMLVideoElement,
  options: CaptureVideoFrameOptions = {}
) => {
  const width = video.videoWidth
  const height = video.videoHeight

  if (!width || !height) {
    throw new Error('相機畫面尚未準備完成')
  }

  const targetSize = resolveTargetSize(width, height, options.maxDimension)
  const canvas = document.createElement('canvas')
  canvas.width = targetSize.width
  canvas.height = targetSize.height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('無法建立拍照畫布')
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(video, 0, 0, targetSize.width, targetSize.height)

  const mimeType = options.mimeType ?? 'image/jpeg'
  const quality = options.quality ?? 0.92
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality)
  })

  canvas.width = 0
  canvas.height = 0

  if (!blob) {
    throw new Error('拍照失敗，請重新嘗試')
  }

  return new File([blob], options.fileName ?? `closy-camera-${Date.now()}.jpg`, {
    type: mimeType,
    lastModified: Date.now(),
  })
}
