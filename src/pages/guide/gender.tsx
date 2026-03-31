import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { showToast } from '@/components/ui/sonner'
import { ApiError } from '@/lib/api/client'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { updateGender } from '@/modules/guide/api/gender'
import { GenderButton } from '@/modules/guide/components/GenderButton'

const Gender = () => {
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState<'男性' | '女性' | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedGender || isSubmitting) return

    const gender = selectedGender === '男性' ? 'male' : 'female'

    try {
      setIsSubmitting(true)
      await updateGender(gender)
      router.push('/guide/add-top')
    } catch (error) {
      if (error instanceof ApiError) {
        showToast.error(error.message)
      } else {
        showToast.error('更新性別失敗，請稍後再試')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col px-4 pt-3 pb-[143px]">
      <section className="flex w-full flex-col gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center"
          type="button"
          onClick={() => router.push('/guide/welcome')}
          aria-label="返回"
        >
          <ChevronLeft size={30} strokeWidth={2} className="text-neutral-700" />
        </button>
        <h2 className="font-h2 p-2">請選擇您的性別</h2>
      </section>
      <section className="mt-12 flex w-full flex-col gap-3">
        <GenderButton
          gender="女性"
          onClick={() => {
            setSelectedGender('女性')
          }}
          selected={selectedGender === '女性'}
        />
        <GenderButton
          gender="男性"
          onClick={() => {
            setSelectedGender('男性')
          }}
          selected={selectedGender === '男性'}
        />
      </section>
      <PrimaryButton
        content="繼續"
        onClick={handleSubmit}
        disabled={!selectedGender || isSubmitting}
        className="mt-auto"
      />
    </main>
  )
}
export default Gender
