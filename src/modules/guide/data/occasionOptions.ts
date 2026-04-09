export type OccasionOption = {
  id: number
  imageUrl: string
  title: string
  desc: string
}

export const occasionOptions: OccasionOption[] = [
  {
    id: 0,
    imageUrl: '/outfit/socialGathering.webp',
    title: '社交聚會',
    desc: '注重風格展現，適合聚餐、看展或約會',
  },
  {
    id: 1,
    imageUrl: '/outfit/campusCasual.webp',
    title: '校園休閒',
    desc: '適合校園生活的舒適穿搭',
  },
  {
    id: 2,
    imageUrl: '/outfit/businessCasual.webp',
    title: '商務休閒',
    desc: '適合辦公室、會議，兼顧專業與舒適感',
  },
  {
    id: 3,
    imageUrl: '/outfit/professional.webp',
    title: '專業職場',
    desc: '需要穿西裝、襯衫等正式商務場合',
  },
]
