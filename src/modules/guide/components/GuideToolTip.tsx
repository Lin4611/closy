import { ToolTipBeak } from './ToolTipBeak'

type GuideToolTipProps = {
  text: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const arrowPositionClass = {
  top: 'absolute left-1/2 top-full -translate-x-1/2 -translate-y-[0.7px]',
  bottom: 'absolute left-1/2 bottom-full -translate-x-1/2 rotate-180 translate-y-[2px]',
  left: 'absolute left-full top-1/2 -translate-y-1/2 -rotate-90 -translate-x-[2px]',
  right: 'absolute right-full top-1/2 -translate-y-1/2 rotate-90 translate-x-[2px]',
}

export const GuideToolTip = ({ text, side = 'top' }: GuideToolTipProps) => {
  return (
    <div className="bg-primary-900 relative inline-flex w-fit max-w-[240px] rounded-[12px] px-4 py-3">
      <span className="font-label-xl wrap-break-word text-white">{text}</span>

      <ToolTipBeak className={`${arrowPositionClass[side]} text-primary-900`} />
    </div>
  )
}
