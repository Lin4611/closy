import { AdjustSuggestionChip } from './AdjustSuggestionChip'
import { outfitAdjustPromptOptions } from '../../data/outfitAdjustOptions'
type QuickAdjustOptionsProps = {
  onSelectOption: (option: string) => void
}
export const QuickAdjustOptions = ({ onSelectOption }: QuickAdjustOptionsProps) => {
  return (
    <section className="flex flex-wrap justify-center gap-x-3 gap-y-4">
      {outfitAdjustPromptOptions.map((option) => (
        <AdjustSuggestionChip
          key={option.id}
          label={option.label}
          onClick={() => onSelectOption(option.label)}
        />
      ))}
    </section>
  )
}
