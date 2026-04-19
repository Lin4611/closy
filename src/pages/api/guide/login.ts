import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { id_token } = req.body
  if (!id_token) return res.status(400).json({ message: '缺少 id_token' })

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token }),
    })

    const setCookies = response.headers.getSetCookie()
    if (setCookies.length > 0) res.setHeader('Set-Cookie', setCookies)

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch {
    return res.status(500).json({ message: 'Google 登入失敗' })
  }
}
