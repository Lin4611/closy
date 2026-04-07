export type OutfitTab = 'overview' | 'groupByOccasion'
export type Occasion = 'socialGathering' | 'campusCasual' | 'businessCasual' | 'professional'
export const occasionLabelMap: Record<Occasion, string> = {
  socialGathering: '社交聚會',
  campusCasual: '校園休閒',
  businessCasual: '商務休閒',
  professional: '專業職場',
}
export type OutfitItem = {
  outfitId: string
  imageUrl: string
  occasionName: Occasion
  savedAt: string
}
export type OccasionId = '1' | '2' | '3' | '4'

export type OccasionKey = 'socialGathering' | 'campusCasual' | 'businessCasual' | 'professional'

export type OccasionMeta = {
  id: OccasionId
  key: OccasionKey
  name: string
  description: string
  imageUrl: string
}

export const occasionMetaMap: Record<OccasionId, OccasionMeta> = {
  '1': {
    id: '1',
    key: 'socialGathering',
    name: '社交聚會',
    description: '注重風格展現，適合聚餐、看展或約會',
    imageUrl: '/outfit/socialGathering.webp',
  },
  '2': {
    id: '2',
    key: 'campusCasual',
    name: '校園休閒',
    description: '適合校園生活的舒適穿搭',
    imageUrl: '/outfit/campusCasual.webp',
  },
  '3': {
    id: '3',
    key: 'businessCasual',
    name: '商務休閒',
    description: '適合辦公室、會議，兼顧專業與舒適感',
    imageUrl: '/outfit/businessCasual.webp',
  },
  '4': {
    id: '4',
    key: 'professional',
    name: '專業職場',
    description: '需要穿西裝、襯衫等正式商務場合',
    imageUrl: '/outfit/professional.webp',
  },
}
