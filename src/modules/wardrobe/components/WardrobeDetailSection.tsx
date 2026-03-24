import { ReactNode } from 'react'

type WardrobeDetailSectionProps = {
  title: string
  required?: boolean
  children: ReactNode
}

export const WardrobeDetailSection = ({
  title,
  required = false,
  children,
}: WardrobeDetailSectionProps) => {
  return (
    <section className="space-y-2.5">
      <div className="flex items-center gap-1">
        <h3 className="font-label-md text-neutral-900">{title}</h3>
        {required ? <span className="font-label-xs text-neutral-400">(可複選)</span> : null}
      </div>
      {children}
    </section>
  )
}
