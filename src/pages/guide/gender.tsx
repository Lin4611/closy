import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { MobileLayout } from '@/modules/common/components/MobileLayout'
import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { GenderButton } from '@/modules/guide/components/GenderButton'

const Gender = () => {
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState<string>('')
  return (
    <MobileLayout>
      <div className="flex min-h-screen flex-col px-4 pt-3 pb-[143px]">
        <section className="flex w-full flex-col gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center"
            type="button"
            onClick={() => router.push('/guide/welcome')}
            aria-label="返回"
          >
            <ChevronLeft size={30} strokeWidth={2} className="text-neutral-700" />
          </button>
          <h2 className="text-h2 p-2">請選擇您的性別</h2>
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
          onClick={() => {}}
          disabled={!selectedGender}
          className="mt-auto"
        />
      </div>
    </MobileLayout>
  )
}
export default Gender
