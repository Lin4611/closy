type CaptureVideoFrameOptions = {
  fileName?: string
  mimeType?: 'image/jpeg' | 'image/png'
  quality?: number
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

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('無法建立拍照畫布')
  }

  context.drawImage(video, 0, 0, width, height)

  const mimeType = options.mimeType ?? 'image/jpeg'
  const quality = options.quality ?? 0.92
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality)
  })

  if (!blob) {
    throw new Error('拍照失敗，請重新嘗試')
  }

  return new File([blob], options.fileName ?? `closy-camera-${Date.now()}.jpg`, {
    type: mimeType,
    lastModified: Date.now(),
  })
}
