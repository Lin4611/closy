import { wardrobeColorOptions } from '../constants/colorOptions'
import { WardrobeColorKey } from '../types'

type WardrobeColorPaletteProps = {
  selectedKeys: WardrobeColorKey[]
  onChange: (next: WardrobeColorKey[]) => void
  displayKeys?: WardrobeColorKey[]
  readOnly?: boolean
}

export const WardrobeColorPalette = ({
  selectedKeys,
  onChange,
  displayKeys,
  readOnly = false,
}: WardrobeColorPaletteProps) => {
  const visibleColors = wardrobeColorOptions.filter((color) =>
    (displayKeys ?? wardrobeColorOptions.map((option) => option.key)).includes(color.key)
  )

  const toggleColor = (key: WardrobeColorKey) => {
    if (readOnly) return

    const hasKey = selectedKeys.includes(key)
    onChange(hasKey ? selectedKeys.filter((item) => item !== key) : [...selectedKeys, key])
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex w-max gap-2">
        {visibleColors.map((color) => {
          const selected = selectedKeys.includes(color.key)

          return (
            <button
              key={color.key}
              type="button"
              onClick={() => toggleColor(color.key)}
              className={`rounded-[12px] p-1.5 transition-all ${selected
                ? 'bg-[#C9B089]'
                : 'bg-transparent'
                } ${readOnly ? 'cursor-default' : ''}`}
            >
              <div className="overflow-hidden rounded-[10px] border border-neutral-300 bg-white">
                <div className="grid h-15 w-15 grid-cols-2">
                  <span className="border border-white/70" style={{ backgroundColor: color.hex }} />
                  <span className="border border-white/70" style={{ backgroundColor: color.hex }} />
                  <span className="border border-white/70 opacity-90" style={{ backgroundColor: color.hex }} />
                  <span className="border border-white/70 opacity-80" style={{ backgroundColor: color.hex }} />
                </div>
              </div>
              <span
                className={`mt-1 inline-flex rounded-full px-2 py-0.5 font-label-xxs-sb ${color.textClassName ?? 'text-white'
                  }`}
                style={{ backgroundColor: color.hex }}
              >
                {color.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}