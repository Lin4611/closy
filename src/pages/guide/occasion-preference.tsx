import { useState } from 'react'

import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { OccasionOptionCard } from '@/modules/guide/components/OccasionOptionCard'
import { occasionOptions } from '@/modules/guide/data/occasionOptions'

const OccasionPreference = () => {
  const [occasionPreference, setOccasionPreference] = useState<number>(0)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 pt-16 pb-12">
      <section className="flex w-full flex-col gap-4">
        <div className="flex flex-1 flex-col justify-center gap-2 p-2">
          <h2 className="font-h2">哪些場合最讓你煩惱？</h2>
          <p className="font-paragraph-sm text-neutral-500">
            選取日常場景，讓Closy為你規劃每日穿搭。
          </p>
        </div>
        <div className="flex flex-col gap-4 px-2 py-3">
          {occasionOptions.map((option) => (
            <OccasionOptionCard
              key={option.id}
              {...option}
              onClick={() => setOccasionPreference(option.id)}
              isSelected={option.id === occasionPreference}
            />
          ))}
        </div>
      </section>
      <PrimaryButton content="完成" href="/guide/location-service" className="mt-auto" />
    </main>
  )
}

export default OccasionPreference
