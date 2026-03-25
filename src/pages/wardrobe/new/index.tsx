import { useRouter } from 'next/router'
import { useEffect } from 'react'

const WardrobeNewEntryPage = () => {
  const router = useRouter()

  useEffect(() => {
    void router.replace('/wardrobe/new/camera')
  }, [router])

  return <div />
}

export default WardrobeNewEntryPage
