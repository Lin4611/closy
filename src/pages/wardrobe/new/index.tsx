import { useEffect } from 'react'
import { useRouter } from 'next/router'

const WardrobeNewEntryPage = () => {
  const router = useRouter()

  useEffect(() => {
    void router.replace('/wardrobe/new/camera')
  }, [router])

  return <div />
}

export default WardrobeNewEntryPage