export type OutfitAdjustPromptOption = {
  id: string
  label: string
}

export const outfitAdjustPromptOptions: OutfitAdjustPromptOption[] = [
  { id: 'cold-add-jacket', label: '覺得有點冷，想加件外套' },
  { id: 'add-light-jacket', label: '都在冷氣房，幫我加件薄外套' },
  { id: 'sun-protection', label: '都在戶外，幫我加強防曬' },
  { id: 'change-to-pants', label: '今天會騎車，想換長褲' },
  { id: 'less-formal', label: '太正式了，休閒一點' },
  { id: 'more-casual', label: '今天想穿得休閒一點' },
  { id: 'too-thin', label: '太薄了' },
  { id: 'too-thick', label: '太厚了' },
]
