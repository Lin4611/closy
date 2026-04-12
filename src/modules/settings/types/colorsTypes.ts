export type Colors =
  | 'white'
  | 'black'
  | 'gray'
  | 'brown'
  | 'yellow'
  | 'orange'
  | 'pink'
  | 'green'
  | 'blue'
  | 'purple'

export const colorsLabelMap: Record<Colors, string> = {
  white: '淺米白',
  black: '深灰黑',
  gray: '中性灰',
  brown: '大地棕',
  yellow: '奶油黃',
  orange: '暖橘紅',
  pink: '粉桃紅',
  green: '自然綠',
  blue: '清爽藍',
  purple: '優雅紫',
}

export type ColorsMeta = {
  id: string
  colorKey: Colors
  name: string
  colors: string[]
}

export const colorsMetaMap: ColorsMeta[] = [
  {
    id: '1',
    colorKey: 'white',
    name: '淺米白',
    colors: ['bg-[#FFFFFF]', 'bg-[#FBF8F2]', 'bg-[#F0EBE1]', 'bg-[#E7E0D5]'],
  },
  {
    id: '2',
    colorKey: 'black',
    name: '深灰黑',
    colors: ['bg-[#1A1A1A]', 'bg-[#2D2D2D]', 'bg-[#4B4B4B]', 'bg-[#6B6B6B]'],
  },
  {
    id: '3',
    colorKey: 'gray',
    name: '中性灰',
    colors: ['bg-[#9E9E9E]', 'bg-[#B0B0B0]', 'bg-[#C8C8C8]', 'bg-[#E0E0E0]'],
  },
  {
    id: '4',
    colorKey: 'brown',
    name: '大地棕',
    colors: ['bg-[#8B5E3B]', 'bg-[#A77B51]', 'bg-[#C4A882]', 'bg-[#D4C4A8]'],
  },
  {
    id: '5',
    colorKey: 'yellow',
    name: '奶油黃',
    colors: ['bg-[#F6E8B1]', 'bg-[#FAF1C7]', 'bg-[#C9A227]', 'bg-[#EEDC82]'],
  },
  {
    id: '6',
    colorKey: 'orange',
    name: '暖橘紅',
    colors: ['bg-[#BF392B]', 'bg-[#E74D3D]', 'bg-[#E67E22]', 'bg-[#F39C11]'],
  },
  {
    id: '7',
    colorKey: 'pink',
    name: '粉桃紅',
    colors: ['bg-[#F8C8C8]', 'bg-[#F4A0A1]', 'bg-[#E0706F]', 'bg-[#C04080]'],
  },
  {
    id: '8',
    colorKey: 'green',
    name: '自然綠',
    colors: ['bg-[#4A7B59]', 'bg-[#6B9F6B]', 'bg-[#90BC90]', 'bg-[#A9C8A0]'],
  },
  {
    id: '9',
    colorKey: 'blue',
    name: '清爽藍',
    colors: ['bg-[#193A5D]', 'bg-[#2E6DA5]', 'bg-[#5AA4D8]', 'bg-[#A9D4F1]'],
  },
  {
    id: '10',
    colorKey: 'purple',
    name: '優雅紫',
    colors: ['bg-[#4B2061]', 'bg-[#7B4FA7]', 'bg-[#A67AD4]', 'bg-[#D4B8E8]'],
  },
]
