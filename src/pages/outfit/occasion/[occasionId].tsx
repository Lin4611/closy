import { ChevronLeft } from 'lucide-react'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useRef, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { fetchOutfitBaseline, type OutfitBaseline } from '@/lib/api/outfit/shared'
import { AppShell } from '@/modules/common/components/AppShell'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { occasionMetaMap } from '@/modules/common/types/occasion'
import { deleteOutfit } from '@/modules/outfit/api/delOutfit'
import { getOutfitBaseline } from '@/modules/outfit/api/outfit'
import { OutfitGridSkeleton } from '@/modules/outfit/components/OutfitCardSkeleton'
import { OutfitEmptyOverView } from '@/modules/outfit/components/OutfitEmptyOverView'
import { OutfitsOverview } from '@/modules/outfit/components/OutfitsOverview'
import { useOutfitServerBaseline } from '@/modules/outfit/hooks/useOutfitServerBaseline'
import { useAppDispatch } from '@/store/hooks'
import { hydrateOutfitBaseline } from '@/store/slices/outfitSlice'

const isValidOccasionId = (value: string) => {
  return occasionMetaMap.some((item) => item.key === value)
}

export const getServerSideProps: GetServerSideProps<{ initialBaseline: OutfitBaseline }> = async ({ req }) => {
  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  try {
    const initialBaseline = await fetchOutfitBaseline(accessToken)

    return {
      props: {
        initialBaseline,
      },
    }
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    throw error
  }
}

const OutfitOccasionDetail = ({ initialBaseline }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useAppDispatch()
  const { outfitList } = useOutfitServerBaseline(initialBaseline)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'confirm' | 'success'>('confirm')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const { occasionId } = router.query

  const occasionOutfits = useMemo(() => {
    if (typeof occasionId !== 'string' || !isValidOccasionId(occasionId)) {
      return []
    }

    return outfitList.filter((item) => item.occasion === occasionId)
  }, [occasionId, outfitList])

  const replaceWithCanonicalBaseline = async () => {
    const nextBaseline = await getOutfitBaseline()
    dispatch(hydrateOutfitBaseline(nextBaseline))
  }

  const delOutfit = async (id: string) => {
    try {
      setIsDeleting(true)
      await deleteOutfit(id)
      setDialogMode('success')
      await replaceWithCanonicalBaseline()
    } catch {
      showToast.error('刪除穿搭失敗')
    } finally {
      setIsDeleting(false)
    }
  }

  if (typeof occasionId !== 'string') {
    return null
  }

  const handleClickDelete = (outfitId: string) => {
    setSelectedOutfitId(outfitId)
    setDialogMode('confirm')
    setIsDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedOutfitId || isDeleting) return
    await delOutfit(selectedOutfitId)
  }

  const handleCloseDialog = () => {
    if (isDeleting) {
      return
    }

    setIsDialogOpen(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDialogMode('confirm')
      setSelectedOutfitId(null)
    }, 150)
  }

  if (!isValidOccasionId(occasionId)) {
    return (
      <AppShell activeTab="outfit">
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 bg-white px-4 py-4.5">
            <div className="relative flex items-center justify-center">
              <Link
                href="/outfit"
                className="absolute left-0 flex size-10 items-center justify-center"
              >
                <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
              </Link>
              <h1 className="font-label-xxl">場合詳情</h1>
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center p-4 text-center">
            <p className="font-label-md text-neutral-500">找不到這個場合</p>
          </div>
        </div>
      </AppShell>
    )
  }

  const occasion = occasionMetaMap.find((item) => item.key === occasionId)

  return (
    <AppShell activeTab="outfit">
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 bg-white px-4 py-3">
          <div className="relative flex items-center justify-center">
            <Link
              href="/outfit"
              onClick={(e) => {
                e.preventDefault()
                void router.push('/outfit')
              }}
              className="absolute left-0 flex size-10 items-center justify-center"
            >
              <ChevronLeft className="text-neutral-700" size={24} strokeWidth={2} />
            </Link>
            <h1 className="font-label-xxl">{occasion?.name}</h1>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col py-4">
          {isDeleting ? (
            <OutfitGridSkeleton />
          ) : occasionOutfits.length > 0 ? (
            <OutfitsOverview
              outfits={occasionOutfits}
              onDelete={handleClickDelete}
              tab="groupByOccasion"
              returnTo={`/outfit/occasion/${occasionId}`}
            />
          ) : (
            <OutfitEmptyOverView />
          )}
        </div>
        <ConfirmAlertDialog
          open={isDialogOpen}
          mode={dialogMode}
          onConfirm={handleConfirmDelete}
          onClose={handleCloseDialog}
        />
      </div>
    </AppShell>
  )
}

export default OutfitOccasionDetail
