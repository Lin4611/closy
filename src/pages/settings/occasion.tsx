import { useRouter } from 'next/router'
import { useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { updateOccasion } from '@/modules/common/api/occasion'
import { ConfirmAlertDialog } from '@/modules/common/components/ConfirmAlertDialog'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { occasionMetaMap, type Occasion } from '@/modules/common/types/occasion'
import { OccasionOptionCard } from '@/modules/guide/components/OccasionOptionCard'
import { SettingsHeader } from '@/modules/settings/components/SettingsHeader'

const SettingOccasion = () => {
  const [occasionPreference, setOccasionPreference] = useState<Occasion>('socialGathering')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const handleOccasionChange = async (value: string) => {
    try {
      await updateOccasion(value as Occasion)
      setIsDialogOpen(true)
    } catch (error) {
      if (error instanceof ApiError) {
        showToast.error(error.message)
      } else {
        showToast.error('更新場合失敗，請稍後再試')
      }
    }
  }
  return (
    <main className="flex min-h-screen flex-col">
      <SettingsHeader title="場合" />
      <div className="flex flex-1 flex-col px-4 pt-20 pb-8">
        <div className="flex flex-col gap-4">
          {occasionMetaMap.map((option) => (
            <OccasionOptionCard
              {...option}
              key={option.key}
              onClick={() => setOccasionPreference(option.key)}
              isSelected={option.key === occasionPreference}
            />
          ))}
        </div>
        <div className="mt-auto flex justify-center pt-6">
          <PrimaryButton
            content="確定"
            onClick={() => handleOccasionChange(occasionPreference)}
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

export default SettingOccasion
