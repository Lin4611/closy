import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { AppShell } from '@/modules/common/components/AppShell'
import { getOutfitList } from '@/modules/outfit/api/outfit'
import type { OutfitItem } from '@/modules/outfit/types/outfitTypes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setOutfitList } from '@/store/slices/outfitSlice'

const DEFAULT_BACK_HREF = '/outfit'

const resolveBackHref = (returnTo: string | string[] | undefined) => {
  if (typeof returnTo !== 'string') return DEFAULT_BACK_HREF
  if (!returnTo.startsWith('/')) return DEFAULT_BACK_HREF

  return returnTo
}

const resolveShowBottomNav = (hideBottomNav: string | string[] | undefined) => {
  if (hideBottomNav !== '1' && hideBottomNav !== 'true') return true

  return false
}

const OutfitDetailPage = () => {
  const router = useRouter()
  const { outfitId, returnTo, hideBottomNav } = router.query
  const backHref = resolveBackHref(returnTo)
  const showBottomNav = resolveShowBottomNav(hideBottomNav)

  const dispatch = useAppDispatch()
  const outfitList = useAppSelector((state) => state.outfit.outfitList)

  const [outfit, setOutfit] = useState<OutfitItem | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  const isLoading = !router.isReady || isFetching

  useEffect(() => {
    if (!router.isReady || typeof outfitId !== 'string') return

    const cached = outfitList.find((item) => item._id === outfitId)
    if (cached) {
      setOutfit(cached)
      return
    }

    const fetchFallback = async () => {
      setIsFetching(true)
      try {
        const list = await getOutfitList()
        const found = list.find((item) => item._id === outfitId) ?? null
        setOutfit(found)
        dispatch(setOutfitList(list))
      } catch {
        setOutfit(null)
      } finally {
        setIsFetching(false)
      }
    }

    const load = async () => {
      await fetchFallback()
    }
    load()
  }, [router.isReady, outfitId, outfitList])

  if (typeof outfitId !== 'string') return null

  const header = (
    <header className="sticky top-0 z-10 bg-white px-4 py-4.5">
      <div className="relative flex items-center justify-center">
        <Link
          href={backHref}
          className={cn('absolute left-0 flex size-10 items-center justify-center')}
        >
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </Link>
        <h1 className="font-label-xxl">穿搭詳情</h1>
      </div>
    </header>
  )

  if (isLoading) {
    return (
      <AppShell activeTab="outfit" showBottomNav={showBottomNav}>
        <div className="flex min-h-0 flex-1 flex-col">
          {header}
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="font-label-md text-neutral-400">載入中...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!outfit) {
    return (
      <AppShell activeTab="outfit" showBottomNav={showBottomNav}>
        <div className="flex min-h-0 flex-1 flex-col">
          {header}
          <div className="flex flex-1 items-center justify-center p-4 text-center">
            <p className="font-label-md text-neutral-500">找不到這套穿搭</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell activeTab="outfit" showBottomNav={showBottomNav}>
      <div className="flex min-h-0 flex-1 flex-col">
        {header}
        <div className="flex flex-1 flex-col gap-4">
          <section className="flex flex-col items-center justify-center pt-3">
            <Image
              src={outfit.outfitImgUrl}
              alt={`outfit-${outfit._id}`}
              width={130}
              height={374}
              className="h-93.5 w-32.5 object-contain"
            />
          </section>

          <section className="flex flex-1 flex-col gap-6 rounded-t-[40px] bg-[#FFFEFE] p-6">
            <h2 className="font-label-xxl">搭配單品</h2>
            <div className="hide-scrollbar flex items-start gap-3 overflow-x-auto">
              {outfit.selectedItems.map((item, index) => (
                <div
                  key={`${item.cloudImgUrl}-${index}`}
                  className="flex min-w-22.5 flex-col items-center gap-2"
                >
                  <div className="flex h-22.5 w-22.5 items-center justify-center rounded-[20px] border border-neutral-300">
                    <Image
                      src={item.cloudImgUrl}
                      alt={item.name}
                      width={90}
                      height={90}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="font-paragraph-sm text-center text-black">{item.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}

export default OutfitDetailPage
