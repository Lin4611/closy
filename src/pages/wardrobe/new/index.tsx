import { useRouter } from 'next/router'
import { useEffect } from 'react'

const WardrobeNewEntryPage = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    void router.replace({
      pathname: '/wardrobe/new/camera',
      query: router.query,
    })
  }, [router])

  return <div />
}

export default WardrobeNewEntryPage
