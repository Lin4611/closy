import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { cn } from '@/lib/utils'
import { AppShell } from '@/modules/common/components/AppShell'
import { mockOutfitDetails } from '@/modules/outfit/data/mockOutfits'

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

  if (typeof outfitId !== 'string') return null

  const outfit = mockOutfitDetails.find((item) => item.id === outfitId)
  if (!outfit) {
    return (
      <AppShell activeTab="outfit" showBottomNav={showBottomNav}>
        <div className="flex min-h-0 flex-1 flex-col">
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
        <header className="sticky top-0 z-10 bg-white px-4 py-4.5">
          <div className="relative flex items-center justify-center">
            <Link href={backHref} className={cn('absolute left-0 flex size-10 items-center justify-center')}>
              <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
            </Link>
            <h1 className="font-label-xxl">穿搭詳情</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4">
          <section className="flex flex-col items-center justify-center pt-3">
            <Image
              src={outfit.imageUrl}
              alt={`outfit-${outfit.id}`}
              width={130}
              height={374}
              className="h-93.5 w-32.5 object-contain"
            />
          </section>

          <section className="flex flex-1 flex-col gap-6 rounded-t-[40px] bg-[#FFFEFE] p-6">
            <h2 className="font-label-xxl">搭配單品</h2>
            <div className="hide-scrollbar flex items-start gap-3 overflow-x-auto">
              {outfit.items.map((item) => (
                <div key={item.id} className="flex min-w-22.5 flex-col items-center gap-2">
                  <div className="flex h-22.5 w-22.5 items-center justify-center rounded-[20px] border border-neutral-300">
                    <Image
                      src={item.imageUrl}
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
