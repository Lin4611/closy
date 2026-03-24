import { wardrobeColorOptions } from '../constants/colorOptions'
import { WardrobeColorKey } from '../types'

type WardrobeColorPaletteProps = {
  selectedKeys: WardrobeColorKey[]
  onChange: (next: WardrobeColorKey[]) => void
}

export const WardrobeColorPalette = ({
  selectedKeys,
  onChange,
}: WardrobeColorPaletteProps) => {
  const toggleColor = (key: WardrobeColorKey) => {
    const hasKey = selectedKeys.includes(key)
    onChange(hasKey ? selectedKeys.filter((item) => item !== key) : [...selectedKeys, key])
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {wardrobeColorOptions.map((color) => {
        const selected = selectedKeys.includes(color.key)

        return (
          <button
            key={color.key}
            type="button"
            onClick={() => toggleColor(color.key)}
            className={`rounded-[16px] border p-2 transition-all ${selected
                ? 'border-primary-900 bg-primary-100 shadow-[inset_0_0_0_1px_#0f172a]'
                : 'border-neutral-200 bg-white'
              }`}
          >
            <div className="overflow-hidden rounded-[12px] border border-white/50">
              <div className="grid grid-cols-2">
                <span className="aspect-square border border-white/70" style={{ backgroundColor: color.hex }} />
                <span className="aspect-square border border-white/70" style={{ backgroundColor: color.hex }} />
                <span className="aspect-square border border-white/70 opacity-90" style={{ backgroundColor: color.hex }} />
                <span className="aspect-square border border-white/70 opacity-80" style={{ backgroundColor: color.hex }} />
              </div>
            </div>
            <span
              className={`font-label-xs mt-2 inline-flex rounded-full px-2 py-1 ${color.textClassName ?? 'text-white'
                }`}
              style={{ backgroundColor: color.hex }}
            >
              {color.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
