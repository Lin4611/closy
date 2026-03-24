import { ReactNode } from 'react'

type TagOption<T extends string> = {
  key: T
  label: string
}

type WardrobeTagGroupProps<T extends string> = {
  options: TagOption<T>[]
  selectedKeys: T[]
  onChange: (next: T[]) => void
  multiple?: boolean
  renderSuffix?: (option: TagOption<T>) => ReactNode
}

export const WardrobeTagGroup = <T extends string>({
  options,
  selectedKeys,
  onChange,
  multiple = true,
  renderSuffix,
}: WardrobeTagGroupProps<T>) => {
  const handleClick = (key: T) => {
    if (multiple) {
      const hasKey = selectedKeys.includes(key)
      onChange(hasKey ? selectedKeys.filter((item) => item !== key) : [...selectedKeys, key])
      return
    }

    onChange([key])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = selectedKeys.includes(option.key)

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => handleClick(option.key)}
            className={`font-label-xs inline-flex items-center gap-1 rounded-full border px-3 py-1.5 transition-colors ${selected
                ? 'border-primary-900 bg-primary-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-500'
              }`}
          >
            {option.label}
            {renderSuffix ? renderSuffix(option) : null}
          </button>
        )
      })}
    </div>
  )
}
