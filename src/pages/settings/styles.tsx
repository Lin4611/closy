import { useRouter } from 'next/router'
import { useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { updateStyles } from '@/modules/settings/api/styles'
import { SettingsHeader } from '@/modules/settings/components/SettingsHeader'
import { StyleCard } from '@/modules/settings/components/StyleCard'
import type { Styles } from '@/modules/settings/types/stylesTypes'
import { stylesMetaMap } from '@/modules/settings/types/stylesTypes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUserStyles } from '@/store/slices/userSlice'

const SettingsStyles = () => {
  const savedStyles = useAppSelector((state) => state.user.user?.preferences.styles ?? [])
  const [stylePreference, setStylePreference] = useState<Styles[]>(savedStyles)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const dispatch = useAppDispatch()

  const router = useRouter()

  const handleStyleChange = async (value: string[]) => {
    if (isSubmitting || value === savedStyles) return

    try {
      setIsSubmitting(true)
      await updateStyles(value as Styles[])
      setIsDialogOpen(true)
      dispatch(updateUserStyles(value as Styles[]))
    } catch (error) {
      if (error instanceof ApiError) {
        showToast.error(error.message)
      } else {
        showToast.error('更新場合失敗，請稍後再試')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <SettingsHeader title="場合" />
      <div className="flex flex-1 flex-col items-center justify-center px-4 pt-3 pb-10">
        <div className="mx-auto grid grid-cols-2 gap-3">
          {stylesMetaMap.map((style) => (
            <StyleCard
              key={style.id}
              id={style.id}
              imageUrl={style.imageUrl}
              name={style.name}
              styleKey={style.styleKey}
              isSelected={stylePreference.includes(style.styleKey)}
              onClick={() =>
                setStylePreference((prev) =>
                  prev.includes(style.styleKey)
                    ? prev.filter((s) => s !== style.styleKey)
                    : [...prev, style.styleKey],
                )
              }
            />
          ))}
        </div>
        <div className="mt-auto flex justify-center pt-6">
          <PrimaryButton
            content="確定"
            onClick={() => handleStyleChange(stylePreference)}
            className="w-40"
          />
        </div>
      </div>
      <ConfirmAlertDialog
        open={isDialogOpen}
        mode="settingSuccess"
        onClose={() => {
          setIsDialogOpen(false)
          router.push('/settings')
        }}
      />
    </main>
  )
}

export default SettingsStyles
