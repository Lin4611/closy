import type { AdjustStreamPayload, AdjustStreamResult } from '@/modules/home/types/outfitAdjustChat'

type SSEEvent =
  | { status: 'processing'; step: 1 | 2; message: string }
  | { status: 'completed'; data: AdjustStreamResult }
  | { status: 'error'; message: string }

type StreamCallbacks = {
  onStep1: (text: string) => void
  onStep2: (text: string) => void
  onCompleted: (result: AdjustStreamResult) => void
  onError: (message: string) => void
}

export const streamOutfitAdjust = async (
  payload: AdjustStreamPayload,
  callbacks: StreamCallbacks,
): Promise<void> => {
  const response = await fetch('/api/adjust/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  })

  if (!response.ok) throw new Error('調整失敗')

  const reader = response.body?.getReader()
  if (!reader) throw new Error('無法讀取串流')

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        const jsonStr = line.slice(5).trim()
        if (!jsonStr) continue

        const event = JSON.parse(jsonStr) as SSEEvent

        if (event.status === 'processing' && event.step === 1) callbacks.onStep1(event.message)
        else if (event.status === 'processing' && event.step === 2) callbacks.onStep2(event.message)
        else if (event.status === 'completed') callbacks.onCompleted(event.data)
        else if (event.status === 'error') callbacks.onError(event.message)
      }
    }
  } finally {
    reader.releaseLock()
  }
}
