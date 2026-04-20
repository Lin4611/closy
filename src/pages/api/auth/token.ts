import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return res.status(401).json({ message: '尚未登入' })
  }

  return res.status(200).json({ accessToken })
}
