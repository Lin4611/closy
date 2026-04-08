import { Mic, ArrowUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type MessageComposerProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onVoiceInput: () => void
  disabled?: boolean
}

export const MessageComposer = ({
  value,
  disabled,
  onChange,
  onSubmit,
  onVoiceInput,
}: MessageComposerProps) => {
  const hasValue = value.trim().length > 0
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    if (!hasValue || disabled) return

    e.preventDefault()
    onSubmit()
  }
  return (
    <div className="flex w-full items-center gap-2 px-[11.5px]">
      <Input
        placeholder="會怕熱或怕冷嗎？告訴我你想怎麼調整..."
        className="font-paragraph-sm placeholder:font-paragraph-sm rounded-[32px] border border-neutral-300 bg-white py-2.25 text-center text-neutral-800 placeholder:text-neutral-500"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        disabled={disabled}
        onKeyDown={handleKeyDown}
      />
      {hasValue ? (
        <Button
          className="size-7.5 rounded-full"
          type="button"
          onClick={onSubmit}
          disabled={disabled}
        >
          <ArrowUp className="size-5" strokeWidth={2} />
        </Button>
      ) : (
        <Button className="size-7.5" variant="ghost" onClick={onVoiceInput} disabled={disabled}>
          <Mic className="size-6 text-neutral-600" strokeWidth={2} />
        </Button>
      )}
    </div>
  )
}
