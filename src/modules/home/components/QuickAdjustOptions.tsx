import { AdjustSuggestionChip } from './AdjustSuggestionChip'
import { outfitAdjustPromptOptions } from '../data/OutfitAdjustOptions'

export const QuickAdjustOptions = () => {
  return (
    <section className="flex flex-wrap justify-center gap-x-3 gap-y-4">
      {outfitAdjustPromptOptions.map((option) => (
        <AdjustSuggestionChip key={option.id} label={option.label} />
      ))}
    </section>
  )
}
