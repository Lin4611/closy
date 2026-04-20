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
  const tokenRes = await fetch('/api/auth/token')
  if (!tokenRes.ok) throw new Error('尚未登入')
  const { accessToken } = (await tokenRes.json()) as { accessToken: string }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/outfit-adjustment/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
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

      let sepIdx: number
      while ((sepIdx = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, sepIdx)
        buffer = buffer.slice(sepIdx + 2)

        const dataLine = rawEvent
          .split('\n')
          .filter((l) => l.startsWith('data:'))
          .map((l) => l.slice(5).trim())
          .join('')

        if (!dataLine) continue

        const event = JSON.parse(dataLine) as SSEEvent

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
