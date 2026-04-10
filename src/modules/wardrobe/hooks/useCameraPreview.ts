import { useCallback, useEffect, useRef, useState } from 'react'

import { captureVideoFrame } from '@/modules/wardrobe/utils/captureVideoFrame'

export type CameraPreviewStatus = 'loading' | 'ready' | 'denied' | 'unsupported' | 'error'

const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: {
      ideal: 'environment',
    },
  },
}

export const useCameraPreview = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<CameraPreviewStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const startCamera = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      setErrorMessage('目前裝置或瀏覽器不支援頁內相機預覽')
      return false
    }

    setStatus('loading')
    setErrorMessage('')

    stopCamera()

    try {
      const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS)
      streamRef.current = stream

      const videoElement = videoRef.current

      if (!videoElement) {
        setStatus('error')
        setErrorMessage('相機預覽初始化失敗，請稍後再試')
        stopCamera()
        return false
      }

      videoElement.srcObject = stream
      videoElement.muted = true
      videoElement.playsInline = true

      try {
        await videoElement.play()
      } catch {
        // 某些瀏覽器不一定需要顯式 play，保留 fallback 即可
      }

      setStatus('ready')
      return true
    } catch (error) {
      const nextMessage =
        error instanceof Error && error.name === 'NotAllowedError'
          ? '尚未取得相機權限，請允許瀏覽器使用相機'
          : '相機啟動失敗，請稍後再試'

      setStatus(error instanceof Error && error.name === 'NotAllowedError' ? 'denied' : 'error')
      setErrorMessage(nextMessage)
      stopCamera()
      return false
    }
  }, [stopCamera])

  const capture = useCallback(async () => {
    const videoElement = videoRef.current

    if (!videoElement || status !== 'ready') {
      throw new Error('相機尚未準備完成')
    }

    return captureVideoFrame(videoElement, {
      fileName: `closy-camera-${Date.now()}.jpg`,
    })
  }, [status])

  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      void startCamera()
    }, 0)

    return () => {
      window.clearTimeout(startTimer)
      stopCamera()
    }
  }, [startCamera, stopCamera])

  return {
    videoRef,
    status,
    errorMessage,
    startCamera,
    stopCamera,
    capture,
  }
}
