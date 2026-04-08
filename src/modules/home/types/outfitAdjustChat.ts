export type OutfitAdjustChatMessage = {
  id: string
  text: string
  role: 'user' | 'assistant'
  status?: 'idle' | 'loading' | 'error'
}
