import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth/logout`, {
      method: 'POST',
    })

    const setCookie = response.headers.get('set-cookie')
    if (setCookie) res.setHeader('Set-Cookie', setCookie)

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch {
    return res.status(500).json({ message: '登出失敗' })
  }
}
