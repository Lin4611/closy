import { cn } from '@/lib/utils'

type CalendarSyncToggleProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const CalendarSyncToggle = ({ checked, onCheckedChange }: CalendarSyncToggleProps) => {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'flex h-8 items-center gap-1.5 rounded-full px-2 py-1 transition-colors',
        checked ? 'bg-neutral-100 text-neutral-800' : 'bg-neutral-100 text-neutral-400'
      )}
      aria-pressed={checked}
      aria-label={checked ? '已同步' : '未同步'}
    >
      <span
        className={cn(
          'flex size-4 items-center justify-center rounded-full text-[10px] font-semibold',
          checked ? 'bg-primary-800 text-white' : 'bg-neutral-300 text-white'
        )}
      >
        G
      </span>
      <span className="font-paragraph-sm">{checked ? '已同步' : '未同步'}</span>
      <span
        className={cn(
          'relative flex h-5 w-9 items-center rounded-full p-0.5 transition-colors',
          checked ? 'bg-primary-800' : 'bg-neutral-300'
        )}
      >
        <span
          className={cn(
            'size-4 rounded-full bg-white transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </span>
    </button>
  )
}
