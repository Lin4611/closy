import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { AppShell } from '@/modules/common/components/AppShell'
import { mockOutfitDetails } from '@/modules/outfit/data/mockOutfits'

const OutfitDetailPage = () => {
  const router = useRouter()
  const { outfitId } = router.query

  if (typeof outfitId !== 'string') return null

  const outfit = mockOutfitDetails.find((item) => item.id === outfitId)
  if (!outfit) {
    return (
      <AppShell activeTab="outfit">
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 bg-white px-4 py-[18px]">
            <div className="relative flex items-center justify-center">
              <Link
                href="/outfit"
                className="absolute left-0 flex size-10 items-center justify-center"
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
    <AppShell activeTab="outfit">
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 bg-white px-4 py-[18px]">
          <div className="relative flex items-center justify-center">
            <Link
              href="/outfit"
              className="absolute left-0 flex size-10 items-center justify-center"
            >
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
              className="h-[374px] w-[130px] object-contain"
            />
          </section>

          <section className="flex flex-1 flex-col gap-6 rounded-t-[40px] bg-[#FFFEFE] p-6">
            <h2 className="font-label-xxl">搭配單品</h2>
            <div className="hide-scrollbar flex items-start gap-3 overflow-x-auto">
              {outfit.items.map((item) => (
                <div key={item.id} className="flex min-w-[90px] flex-col items-center gap-2">
                  <div className="flex h-[90px] w-[90px] items-center justify-center rounded-[20px] border border-neutral-300">
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
