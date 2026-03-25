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
          sizes="(max-width: 375px) 40vw, 156px"
          className="object-contain"
        />
      )
    }

    return <Package className="h-16 w-16 text-neutral-300" strokeWidth={1.6} />
  }, [item.imageUrl, item.name])

  return (
    <article className="rounded-[12px] border border-neutral-200 bg-white px-3 pt-3 pb-2">
      <Link href={`/wardrobe/${item.id}`} className="block">
        <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-[8px]">
          <div className="relative h-full w-full px-3 py-1">{preview}</div>
        </div>
      </Link>

      <div className="mt-2 flex items-end justify-between gap-2">
        <Link href={`/wardrobe/${item.id}`} className="min-w-0 flex-1">
          <div className="space-y-0.5">
            <p className="truncate font-label-xs text-neutral-900">{item.name}</p>
            <p className="font-label-xxs-r text-neutral-500">{item.createdAt}</p>
            <p className="truncate font-label-xxs-r text-neutral-400">{item.brand}</p>
          </div>
        </Link>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-6 w-6 items-center justify-center text-neutral-400"
            aria-label={`${item.name} 更多操作`}
          >
            <EllipsisVertical className="h-3.5 w-3.5" strokeWidth={2.1} />
          </button>

          <WardrobeItemMenu
            open={isMenuOpen}
            align="card"
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
    </article>
  )
}