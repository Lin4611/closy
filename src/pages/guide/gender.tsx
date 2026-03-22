import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { GenderButton } from '@/modules/guide/components/GenderButton'
import { PrimaryButton } from '@/modules/guide/components/PrimaryButton'

const Gender = () => {
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState<string>('')
  return (
    <div className="flex w-full max-w-[375px] flex-col bg-neutral-100 px-4 pt-3">
      <section className="flex w-full flex-col gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center"
          type="button"
          onClick={() => router.push('/guide/welcome')}
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
        className="mt-[328px]"
      />
    </div>
  )
}
export default Gender
