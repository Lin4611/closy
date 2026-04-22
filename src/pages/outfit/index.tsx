import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRef, useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { fetchOutfitBaseline, type OutfitBaseline } from '@/lib/api/outfit/shared'
import { AppShell } from '@/modules/common/components/AppShell'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { deleteOutfit } from '@/modules/outfit/api/delOutfit'
import { getOutfitBaseline } from '@/modules/outfit/api/outfit'
import { OutfitsContentSection } from '@/modules/outfit/components/OutfitsContentSection'
import { useOutfitServerBaseline } from '@/modules/outfit/hooks/useOutfitServerBaseline'
import { useAppDispatch } from '@/store/hooks'
import { hydrateOutfitBaseline } from '@/store/slices/outfitSlice'

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

const Outfit = ({ initialBaseline }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useAppDispatch()
  const { outfitList, occasionsList } = useOutfitServerBaseline(initialBaseline)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'confirm' | 'success'>('confirm')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const replaceWithCanonicalBaseline = async () => {
    const nextBaseline = await getOutfitBaseline()
    dispatch(hydrateOutfitBaseline(nextBaseline))
  }

  const delOutfit = async (id: string) => {
    try {
      await deleteOutfit(id)
      setDialogMode('success')
      await replaceWithCanonicalBaseline()
    } catch {
      showToast.error('刪除穿搭失敗')
    } finally {
    }
  }

  const handleClickDelete = (outfitId: string) => {
    setSelectedOutfitId(outfitId)
    setDialogMode('confirm')
    setIsDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedOutfitId) return
    await delOutfit(selectedOutfitId)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDialogMode('confirm')
      setSelectedOutfitId(null)
    }, 150)
  }

  return (
    <AppShell activeTab="outfit">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 shrink-0 bg-white px-4 py-3 shadow-[0px_1px_3px_0px_#18181B0D]">
          <h1 className="font-h1">我的穿搭</h1>
          <p className="font-paragraph-sm text-neutral-500">回顧已收藏的穿搭</p>
        </div>
        <OutfitsContentSection
          outfits={outfitList}
          onDelete={handleClickDelete}
          occasionsList={occasionsList}
        />
      </div>
      <ConfirmAlertDialog
        open={isDialogOpen}
        mode={dialogMode}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDialog}
      />
    </AppShell>
  )
}

export default Outfit
