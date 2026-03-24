import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { MobileLayout } from '@/modules/common/components/MobileLayout'

const WardrobeNewEntryPage = () => {
  const router = useRouter()

  useEffect(() => {
    void router.replace('/wardrobe/new/camera')
  }, [router])

  return <MobileLayout className="min-h-screen"><div /></MobileLayout>
}

export default WardrobeNewEntryPage