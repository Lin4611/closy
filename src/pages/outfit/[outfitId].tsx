import { ChevronLeft } from 'lucide-react'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { ApiError } from '@/lib/api/client'
import { fetchOutfitServerDetail } from '@/lib/api/outfit/shared'
import { cn } from '@/lib/utils'
import { AppShell } from '@/modules/common/components/AppShell'
import { useOutfitServerItem } from '@/modules/outfit/hooks/useOutfitServerItem'
import type { OutfitDetail } from '@/modules/outfit/types/outfitTypes'

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

export const getServerSideProps: GetServerSideProps<{ initialOutfit: OutfitDetail }> = async ({ params, req }) => {
  const accessToken = req.cookies.accessToken
  const outfitId = typeof params?.outfitId === 'string' ? params.outfitId : null

  if (!accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (!outfitId) {
    return {
      notFound: true,
    }
  }

  try {
    const initialOutfit = await fetchOutfitServerDetail(accessToken, outfitId)

    return {
      props: {
        initialOutfit,
      },
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }

      if (error.statusCode === 404) {
        return {
          notFound: true,
        }
      }
    }

    throw error
  }
}

const OutfitDetailPage = ({ initialOutfit }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { returnTo, hideBottomNav } = router.query
  const backHref = resolveBackHref(returnTo)
  const showBottomNav = resolveShowBottomNav(hideBottomNav)
  const outfit = useOutfitServerItem(initialOutfit)

  const header = (
    <header className="sticky top-0 z-10 bg-white px-4 py-4.5">
      <div className="relative flex items-center justify-center">
        <Link
          href={backHref}
          onClick={(e) => {
            e.preventDefault()
            void router.push(backHref)
          }}
          className={cn('absolute left-0 flex size-10 items-center justify-center')}
        >
          <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
        </Link>
        <h1 className="font-label-xxl">穿搭詳情</h1>
      </div>
    </header>
  )

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
