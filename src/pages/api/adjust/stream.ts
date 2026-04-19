import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: { responseLimit: false },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const accessToken = req.cookies.accessToken
  if (!accessToken) return res.status(401).json({ message: '尚未登入' })

  const backendRes = await fetch(`${process.env.API_BASE_URL}/outfit-adjustment/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(req.body),
  })

  if (!backendRes.ok) {
    return res.status(backendRes.status).json({ message: '調整失敗' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const reader = backendRes.body?.getReader()
  if (!reader) return res.status(500).end()

  const decoder = new TextDecoder()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(decoder.decode(value))
    }
  } finally {
    reader.releaseLock()
    res.end()
  }
}
