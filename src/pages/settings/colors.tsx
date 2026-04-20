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
import { updateColors } from '@/modules/settings/api/colors'
import { ColorCard } from '@/modules/settings/components/ColorCard'
import { SettingsHeader } from '@/modules/settings/components/SettingsHeader'
import { useSettingsProfileHydration } from '@/modules/settings/hooks/useSettingsProfileHydration'
import { colorsMetaMap } from '@/modules/settings/types/colorsTypes'
import type { Colors } from '@/modules/settings/types/colorsTypes'
import { useAppDispatch } from '@/store/hooks'
import { updateUserColors } from '@/store/slices/userSlice'

const hasSameSelections = (current: Colors[], baseline: Colors[]) => {
  return current.length === baseline.length && current.every((selectedColor) => baseline.includes(selectedColor))
}

export const getServerSideProps: GetServerSideProps<{
  profileBaseline: SettingsProfileBaseline
}> = async (context) => {
  return getSettingsProtectedBaselineServerSideResult(context)
}

const SettingColors = ({ profileBaseline }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const initialColors = profileBaseline.preferences.colors
  const [colorPreference, setColorPreference] = useState<Colors[]>(initialColors)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const dispatch = useAppDispatch()

  const router = useRouter()

  useSettingsProfileHydration(profileBaseline)

  const handleColorChange = async (value: Colors[]) => {
    if (isSubmitting || hasSameSelections(value, initialColors)) {
      router.push('/settings?status=unchanged')
      return
    }

    try {
      setIsSubmitting(true)
      await updateColors(value)
      setIsDialogOpen(true)
      dispatch(updateUserColors(value))
    } catch (error) {
      if (error instanceof ApiError) {
        showToast.error(error.message)
      } else {
        showToast.error('更新色系失敗，請稍後再試')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <SettingsHeader title="色系" />
      <div className="flex flex-1 flex-col items-center justify-center px-4 pt-3 pb-10">
        <div className="mx-auto grid grid-cols-3 gap-3">
          {colorsMetaMap.map((color) => (
            <ColorCard
              key={color.id}
              id={color.id}
              colors={color.colors}
              name={color.name}
              colorKey={color.colorKey}
              isSelected={colorPreference.includes(color.colorKey)}
              onClick={() =>
                setColorPreference((prev) =>
                  prev.includes(color.colorKey)
                    ? prev.filter((selectedColor) => selectedColor !== color.colorKey)
                    : [...prev, color.colorKey],
                )
              }
            />
          ))}
        </div>
        <div className="mt-auto flex justify-center pt-6">
          <PrimaryButton content="確定" onClick={() => handleColorChange(colorPreference)} className="w-40" />
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
export default SettingColors
