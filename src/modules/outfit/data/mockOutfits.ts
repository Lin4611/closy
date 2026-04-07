import type { OutfitDetail, OutfitSummary } from '../types/outfitTypes'

export const mockOutfitDetails: OutfitDetail[] = [
  {
    id: '1',
    imageUrl: '/outfit/mock-1.webp',
    occasionKey: 'campusCasual',
    savedAt: '2026-04-01',
    items: [
      {
        id: 'top-1',
        name: '白色帽T',
        imageUrl: '/wardrobe/hoodie.png',
        category: 'top',
      },
      {
        id: 'bottom-1',
        name: '卡其工裝褲',
        imageUrl: '/wardrobe/cargo-pants.png',
        category: 'bottom',
      },
    ],
  },
  {
    id: '2',
    imageUrl: '/outfit/mock-2.webp',
    occasionKey: 'socialGathering',
    savedAt: '2026-04-02',
    items: [
      {
        id: 'top-2',
        name: '針織上衣',
        imageUrl: '/wardrobe/knit-top.png',
        category: 'top',
      },
      {
        id: 'bottom-2',
        name: '牛仔褲',
        imageUrl: '/wardrobe/jeans.png',
        category: 'bottom',
      },
    ],
  },
  {
    id: '3',
    imageUrl: '/outfit/mock-1.webp',
    occasionKey: 'businessCasual',
    savedAt: '2026-04-03',
    items: [
      {
        id: 'top-3',
        name: 'T-shirt',
        imageUrl: '/wardrobe/tshirt.png',
        category: 'top',
      },
      {
        id: 'bottom-3',
        name: '棕色長褲',
        imageUrl: '/wardrobe/brown-pants.png',
        category: 'bottom',
      },
    ],
  },
  {
    id: '4',
    imageUrl: '/outfit/mock-2.webp',
    occasionKey: 'professional',
    savedAt: '2026-04-04',
    items: [
      {
        id: 'top-4',
        name: '針織上衣',
        imageUrl: '/wardrobe/knit-top.png',
        category: 'top',
      },
      {
        id: 'bottom-4',
        name: '牛仔褲',
        imageUrl: '/wardrobe/jeans.png',
        category: 'bottom',
      },
    ],
  },
  {
    id: '5',
    imageUrl: '/outfit/mock-2.webp',
    occasionKey: 'professional',
    savedAt: '2026-04-23',
    items: [
      {
        id: 'top-5',
        name: '針織上衣',
        imageUrl: '/wardrobe/knit-top.png',
        category: 'top',
      },
      {
        id: 'bottom-5',
        name: '牛仔褲',
        imageUrl: '/wardrobe/jeans.png',
        category: 'bottom',
      },
    ],
  },
  {
    id: '6',
    imageUrl: '/outfit/mock-2.webp',
    occasionKey: 'professional',
    savedAt: '2026-04-22',
    items: [
      {
        id: 'top-6',
        name: '針織上衣',
        imageUrl: '/wardrobe/knit-top.png',
        category: 'top',
      },
      {
        id: 'bottom-6',
        name: '牛仔褲',
        imageUrl: '/wardrobe/jeans.png',
        category: 'bottom',
      },
    ],
  },
]

export const mockOutfits: OutfitSummary[] = mockOutfitDetails.map(
  ({ id, imageUrl, occasionKey, savedAt }) => ({
    id,
    imageUrl,
    occasionKey,
    savedAt,
  }),
)
