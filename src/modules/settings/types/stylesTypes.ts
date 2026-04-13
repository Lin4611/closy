export type Styles =
  | 'simple'
  | 'city'
  | 'street'
  | 'american'
  | 'japanese'
  | 'korean'
  | 'retro'
  | 'outdoor'
  | 'sweety'

export const stylesLabelMap: Record<Styles, string> = {
  simple: '簡約',
  city: '通勤都會',
  street: '街頭潮流',
  american: '美式',
  japanese: '日系',
  korean: '韓系',
  retro: '復古',
  outdoor: '戶外機能',
  sweety: '甜美可愛',
}

export type StylesMeta = {
  id: string
  styleKey: Styles
  name: string
  imageUrl: string
}

export const stylesMetaMap: StylesMeta[] = [
  {
    id: '1',
    styleKey: 'simple',
    name: '簡約',
    imageUrl: '/settings/simple.webp',
  },
  {
    id: '2',
    styleKey: 'city',
    name: '通勤都會',
    imageUrl: '/settings/city.webp',
  },
  {
    id: '3',
    styleKey: 'street',
    name: '街頭潮流',
    imageUrl: '/settings/street.webp',
  },
  {
    id: '4',
    styleKey: 'american',
    name: '美式',
    imageUrl: '/settings/american.webp',
  },
  {
    id: '5',
    styleKey: 'japanese',
    name: '日系',
    imageUrl: '/settings/japanese.webp',
  },
  {
    id: '6',
    styleKey: 'korean',
    name: '韓系',
    imageUrl: '/settings/korean.webp',
  },
  {
    id: '7',
    styleKey: 'retro',
    name: '復古',
    imageUrl: '/settings/retro.webp',
  },
  {
    id: '8',
    styleKey: 'outdoor',
    name: '戶外機能',
    imageUrl: '/settings/outdoor.webp',
  },
  {
    id: '9',
    styleKey: 'sweety',
    name: '甜美可愛',
    imageUrl: '/settings/sweety.webp',
  },
]
