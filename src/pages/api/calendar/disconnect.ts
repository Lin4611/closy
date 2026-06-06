 import type { NextApiRequest, NextApiResponse } from 'next'

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end()

    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.status(401).json({ message: '未登入' })


    try {
      const response = await fetch(`${process.env.API_BASE_URL}/google-calendar/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await response.json()
      return res.status(response.status).json(data)
    } catch {
      return res.status(500).json({ message: 'Google Calendar 解除連結失敗' })
    }
  }