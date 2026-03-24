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
          sizes="136px, 100px"
          className="object-contain p-3"
        />
      )
    }

    return <Package className="h-16 w-16 text-neutral-300" strokeWidth={1.6} />
  }, [item.imageUrl, item.name])

  return (
    <article className="max-w-40 w-full min-h-50 rounded-[16px] border border-neutral-300 bg-white px-3 py-3 space-y-3 shadow-[0_2px_12px_rgba(0,0,0,0.0.03)]">
      <div className="relative overflow-hidden">
        <Link href={`/wardrobe/${item.id}`} className="relative block aspect-[1.36/1]">
          <div className="absolute inset-0 flex items-center justify-center">{preview}</div>
        </Link>

        <div ref={menuRef} className="absolute right-0 bottom-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-7 w-7 items-center justify-center text-neutral-500 "
            aria-label={`${item.name} 更多操作`}
          >
            <EllipsisVertical className="h-4 w-4" strokeWidth={2.1} />
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

      <div className="space-y-1">
        <p className="truncate font-label-sm text-neutral-900">{item.name}</p>
        <p className="font-label-xs text-neutral-400">{item.createdAt}</p>
        <p className="font-label-xs text-neutral-400">{item.brand}</p>
      </div>
    </article>
  )
}
