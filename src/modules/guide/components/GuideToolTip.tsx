import { ToolTipBeak } from './ToolTipBeak'

type GuideToolTipProps = {
  text: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  onClose?: () => void
  className?: string
}

const arrowPositionClass = {
  top: 'absolute left-1/2 top-full -translate-x-1/2 -translate-y-[0.8px]',
  bottom: 'absolute left-1/2 bottom-full -translate-x-1/2 rotate-180 translate-y-[2px]',
  left: 'absolute left-full top-1/2 -translate-y-1/2 -rotate-90 -translate-x-[2px]',
  right: 'absolute right-full top-1/2 -translate-y-1/2 rotate-90 translate-x-[2px]',
}

export const GuideToolTip = ({ text, side = 'top', onClose, className }: GuideToolTipProps) => {
  return (
    <div
      className={`bg-primary-800 relative inline-flex w-fit max-w-62 items-center rounded-[12px] px-4 py-3 shadow-[0px_4px_8px_0px_rgba(15,23,42,0.15)] ${className ?? ''}`}
    >
      <span className="font-label-md flex-1 whitespace-nowrap text-white">{text}</span>

      {onClose && (
        <button onClick={onClose} className="ml-3 text-white opacity-70 hover:opacity-100">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      <ToolTipBeak className={`${arrowPositionClass[side]} text-primary-800`} />
    </div>
  )
}
