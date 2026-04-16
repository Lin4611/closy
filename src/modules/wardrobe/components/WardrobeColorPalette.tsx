import { Check } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

import { cn } from '@/lib/utils'

import { wardrobeColorOptions } from '../constants/colorOptions'
import type { WardrobeColorKey } from '../types'

type WardrobeColorPaletteProps = {
  selectedKeys: WardrobeColorKey[]
  onChange: (next: WardrobeColorKey[]) => void
  displayKeys?: WardrobeColorKey[]
  readOnly?: boolean
  selectionMode?: 'single' | 'multiple'
}

const wardrobeColorCardClassMap: Record<WardrobeColorKey, string[]> = {
  light_beige: ['bg-[#FFFFFF]', 'bg-[#FBF8F2]', 'bg-[#F0EBE1]', 'bg-[#E7E0D5]'],
  dark_gray_black: ['bg-[#1A1A1A]', 'bg-[#2D2D2D]', 'bg-[#4B4B4B]', 'bg-[#6B6B6B]'],
  neutral_gray: ['bg-[#9E9E9E]', 'bg-[#B0B0B0]', 'bg-[#C8C8C8]', 'bg-[#E0E0E0]'],
  earth_brown: ['bg-[#8B5E3B]', 'bg-[#A77B51]', 'bg-[#C4A882]', 'bg-[#D4C4A8]'],
  butter_yellow: ['bg-[#F6E8B1]', 'bg-[#FAF1C7]', 'bg-[#C9A227]', 'bg-[#EEDC82]'],
  warm_orange_red: ['bg-[#BF392B]', 'bg-[#E74D3D]', 'bg-[#E67E22]', 'bg-[#F39C11]'],
  rose_pink: ['bg-[#F8C8C8]', 'bg-[#F4A0A1]', 'bg-[#E0706F]', 'bg-[#C04080]'],
  natural_green: ['bg-[#4A7B59]', 'bg-[#6B9F6B]', 'bg-[#90BC90]', 'bg-[#A9C8A0]'],
  fresh_blue: ['bg-[#193A5D]', 'bg-[#2E6DA5]', 'bg-[#5AA4D8]', 'bg-[#A9D4F1]'],
  elegant_purple: ['bg-[#4B2061]', 'bg-[#7B4FA7]', 'bg-[#A67AD4]', 'bg-[#D4B8E8]'],
}

const roundedMap: Record<number, string> = {
  0: 'rounded-tl-[16px]',
  1: 'rounded-tr-[16px]',
  2: 'rounded-bl-[16px]',
  3: 'rounded-br-[16px]',
}

export const WardrobeColorPalette = ({
  selectedKeys,
  onChange,
  displayKeys,
  readOnly = false,
  selectionMode = 'multiple',
}: WardrobeColorPaletteProps) => {
  const visibleColors = useMemo(
    () =>
      wardrobeColorOptions.filter((color) =>
        (displayKeys ?? wardrobeColorOptions.map((option) => option.key)).includes(color.key)
      ),
    [displayKeys]
  )

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const firstSelectedKey = selectedKeys.find((key) => visibleColors.some((color) => color.key === key))

    if (!firstSelectedKey) {
      return
    }

    const container = scrollContainerRef.current
    const selectedItem = itemRefs.current[firstSelectedKey]

    if (!container || !selectedItem) {
      return
    }

    const containerLeft = container.scrollLeft
    const containerRight = containerLeft + container.clientWidth
    const itemLeft = selectedItem.offsetLeft
    const itemRight = itemLeft + selectedItem.offsetWidth

    if (itemLeft < containerLeft || itemRight > containerRight) {
      container.scrollTo({
        left: Math.max(itemLeft - 12, 0),
        behavior: 'smooth',
      })
    }
  }, [selectedKeys, visibleColors])

  const toggleColor = (key: WardrobeColorKey) => {
    if (readOnly) return

    const hasKey = selectedKeys.includes(key)

    if (selectionMode === 'single') {
      onChange(hasKey ? selectedKeys : [key])
      return
    }

    onChange(hasKey ? selectedKeys.filter((item) => item !== key) : [...selectedKeys, key])
  }

  return (
    <div ref={scrollContainerRef} className="overflow-x-auto p-0.75">
      <div className="flex w-max gap-3">
        {visibleColors.map((color) => {
          const selected = selectedKeys.includes(color.key)
          const swatchClasses = wardrobeColorCardClassMap[color.key]

          return (
            <button
              key={color.key}
              ref={(node) => {
                itemRefs.current[color.key] = node
              }}
              type="button"
              onClick={() => toggleColor(color.key)}
              className={cn(
                'relative grid grid-cols-2 gap-0.5 rounded-[16px] bg-transparent transition-all',
                selected ? 'ring-primary-800 ring-3' : '',
                readOnly ? 'cursor-default' : 'cursor-pointer'
              )}
            >
              {swatchClasses.map((swatchClassName, index) => (
                <div key={`${color.key}-${index}`} className={cn('size-12.25', swatchClassName, roundedMap[index])} />
              ))}
              <div className="absolute bottom-1 left-1/2 w-13 -translate-x-1/2 rounded-[20px] bg-black/30 px-2 py-0.5 text-center backdrop-blur-sm">
                <p className="font-label-xs text-white">{color.label}</p>
              </div>
              {selected ? (
                <div className="bg-primary-800 absolute top-2 right-2 flex size-6 items-center justify-center rounded-full">
                  <Check size={16} strokeWidth={3} className="text-white" />
                </div>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
