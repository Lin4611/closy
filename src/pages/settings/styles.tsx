import { useState } from 'react'

import { PrimaryButton } from '@/modules/common/components/PrimaryButton'
import { SettingsHeader } from '@/modules/settings/components/SettingsHeader'
import { StyleCard } from '@/modules/settings/components/StyleCard'
import type { Styles } from '@/modules/settings/types/stylesTypes'
import { stylesMetaMap } from '@/modules/settings/types/stylesTypes'

const SettingsStyles = () => {
  const [stylePreference, setStylePreference] = useState<Styles>('simple')

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
              isSelected={stylePreference === style.styleKey}
              onClick={() => setStylePreference(style.styleKey)}
            />
          ))}
        </div>
        <div className="mt-auto flex justify-center pt-6">
          <PrimaryButton content="確定" onClick={() => {}} className="w-40" />
        </div>
      </div>
    </main>
  )
}

export default SettingsStyles
