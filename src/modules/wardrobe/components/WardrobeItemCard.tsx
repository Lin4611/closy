import Image from 'next/image'
import Link from 'next/link'
import { EllipsisVertical, Package } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { WardrobeItem } from '../types'
import { WardrobeItemMenu } from './WardrobeItemMenu'

type WardrobeItemCardProps = {
  item: WardrobeItem
  onDelete: (id: string) => void
}

export const WardrobeItemCard = ({ item, onDelete }: WardrobeItemCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const preview = useMemo(() => {
    if (item.imageUrl) {
      return (
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 375px) 44vw, 160px"
          className="object-contain px-3 py-2"
        />
      )
    }

    return <Package className="h-16 w-16 text-neutral-300" strokeWidth={1.6} />
  }, [item.imageUrl, item.name])

  return (
    <article className="relative min-h-[128px] w-full rounded-[12px] border border-neutral-300 bg-white px-3 pt-3 pb-2 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="relative">
        <Link href={`/wardrobe/${item.id}`} className="block">
          <div className="relative h-[92px] overflow-hidden rounded-[8px]">
            <div className="absolute inset-0 flex items-center justify-center">{preview}</div>
          </div>
        </Link>

        <div ref={menuRef} className="absolute top-0 right-[-4px] z-20">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-6 w-6 items-center justify-center text-neutral-500"
            aria-label={`${item.name} 更多操作`}
          >
            <EllipsisVertical className="h-[14px] w-[14px]" strokeWidth={2.1} />
          </button>

          <WardrobeItemMenu
            open={isMenuOpen}
            onEdit={() => {
              setIsMenuOpen(false)
              window.location.href = `/wardrobe/${item.id}/edit`
            }}
            onDelete={() => {
              setIsMenuOpen(false)
              onDelete(item.id)
            }}
          />
        </div>
      </div>

      <div className="mt-1 space-y-0.5">
        <p className="truncate font-label-xs text-neutral-900">{item.name}</p>
        <p className="font-label-xxs-r text-neutral-500">{item.createdAt}</p>
        <p className="font-label-xxs-r text-neutral-400">{item.brand}</p>
      </div>
    </article>
  )
}