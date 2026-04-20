import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import {
  getSettingsProtectedBaselineServerSideResult,
  type SettingsProfileBaseline,
} from '@/lib/api/settings/shared'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { updateStyles } from '@/modules/settings/api/styles'
import { SettingsHeader } from '@/modules/settings/components/SettingsHeader'
import { StyleCard } from '@/modules/settings/components/StyleCard'
import { useSettingsProfileHydration } from '@/modules/settings/hooks/useSettingsProfileHydration'
import type { Styles } from '@/modules/settings/types/stylesTypes'
import { stylesMetaMap } from '@/modules/settings/types/stylesTypes'
import { useAppDispatch } from '@/store/hooks'
import { updateUserStyles } from '@/store/slices/userSlice'

export const getServerSideProps: GetServerSideProps<{
  profileBaseline: SettingsProfileBaseline
}> = async (context) => {
  return getSettingsProtectedBaselineServerSideResult(context)
}

const SettingsStyles = ({ profileBaseline }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const initialStyles = profileBaseline.preferences.styles
  const [stylePreference, setStylePreference] = useState<Styles[]>(initialStyles)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const dispatch = useAppDispatch()

  const router = useRouter()

  useSettingsProfileHydration(profileBaseline)

  const handleStyleChange = async (value: Styles[]) => {
    if (
      isSubmitting ||
      (value.length === initialStyles.length && value.every((selectedStyle, index) => selectedStyle === initialStyles[index]))
    ) {
      router.push('/settings?status=unchanged')
      return
    }

    try {
      setIsSubmitting(true)
      await updateStyles(value)
      setIsDialogOpen(true)
      dispatch(updateUserStyles(value))
    } catch (error) {
      if (error instanceof ApiError) {
        showToast.error(error.message)
      } else {
        showToast.error('更新風格失敗，請稍後再試')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <SettingsHeader title="風格" />
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
                    ? prev.filter((selectedStyle) => selectedStyle !== style.styleKey)
                    : [...prev, style.styleKey],
                )
              }
            />
          ))}
        </div>
        <div className="mt-auto flex justify-center pt-6">
          <PrimaryButton content="確定" onClick={() => handleStyleChange(stylePreference)} className="w-40" />
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
