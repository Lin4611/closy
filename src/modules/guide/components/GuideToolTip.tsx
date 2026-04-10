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
    <div className="bg-primary-800 relative inline-flex w-fit max-w-62 rounded-[12px] px-4 py-3 shadow-[0px_4px_8px_0px_rgba(15,23,42,0.15)]">
      <span className="font-label-xl whitespace-nowrap text-white">{text}</span>

      <ToolTipBeak className={`${arrowPositionClass[side]} text-primary-800`} />
    </div>
  )
}
