export type OverlayPlacement = {
  top?: number
  left?: number
  right?: number
  bottom?: number
}

export type SpotlightTarget = {
  id: string
  padding?: number
  radius?: number
}
export type CardAnchor = 'top' | 'right' | 'bottom' | 'left' | 'center'
export type BubbleAnchor = 'top' | 'right' | 'bottom' | 'left' | 'center'
export type LineAnchor = 'top' | 'right' | 'bottom' | 'left' | 'center'
export type OnboardingCallout = {
  text: string
  bubblePlacement?: OverlayPlacement
  bubbleAnchor?: BubbleAnchor
  bubbleOffsetX?: number
  bubbleOffsetY?: number
  lineFrom?: LineAnchor
  lineTo?: LineAnchor
  targetIndex?: number
}

export type OnboardingStepProps = {
  id: string
  title: string
  description: string
  targets: SpotlightTarget[]
  cardPlacement?: OverlayPlacement
  cardAnchor?: CardAnchor
  cardOffsetX?: number
  cardOffsetY?: number
  cardTargetIndex?: number
  callouts?: OnboardingCallout[]
}

export const ONBOARDING_STEPS: OnboardingStepProps[] = [
  {
    id: 'occasion',
    targets: [
      { id: 'occasion-trigger', padding: 8, radius: 20 },
      { id: 'settings', padding: 0, radius: 999 },
    ],
    title: '場合',
    description: '點選即可快速切換需要的場合',
    cardAnchor: 'bottom',
    cardOffsetX: -150,
    cardOffsetY: 20,
    cardTargetIndex: 0,
    callouts: [
      {
        text: '設定裡也可以更改場合',
        bubbleAnchor: 'left',
        bubbleOffsetX: -30,
        bubbleOffsetY: -50,
        lineFrom: 'right',
        lineTo: 'top',
        targetIndex: 1,
      },
    ],
  },
  {
    id: 'like',
    targets: [{ id: 'like', padding: 0, radius: 999 }],
    title: '喜歡這套穿搭？',
    description: '按 ❤️ 即可收藏到「我的穿搭」',
    cardAnchor: 'top',
    cardOffsetX: -120,
    cardOffsetY: -150,
    cardTargetIndex: 0,
    callouts: [
      {
        text: '喜歡',
        bubbleAnchor: 'top',
        bubbleOffsetX: 0,
        bubbleOffsetY: -80,
        lineFrom: 'bottom',
        lineTo: 'top',
        targetIndex: 0,
      },
    ],
  },
  {
    id: 'dislike',
    targets: [{ id: 'dislike', padding: 0, radius: 999 }],
    title: '不喜歡這套穿搭...',
    description: '按 ✖，讓 Closy 調整推薦方向',
    cardAnchor: 'top',
    cardOffsetX: 120,
    cardOffsetY: -50,
    cardTargetIndex: 0,
    callouts: [
      {
        text: '不喜歡',
        bubbleAnchor: 'right',
        bubbleOffsetX: 80,
        bubbleOffsetY: 0,
        lineFrom: 'left',
        lineTo: 'right',
        targetIndex: 0,
      },
    ],
  },
  {
    id: 'calendar',
    targets: [
      { id: 'calendar-card', padding: 0, radius: 16 },
      { id: 'add-calendar-button', padding: 0, radius: 999 },
    ],
    title: '行事曆',
    description:
      '連結 Google 行事曆，記錄每個場合\n快速回顧過去同樣場合的穿搭\n更輕鬆選擇今天要穿什麼',
    cardAnchor: 'top',
    cardOffsetX: 0,
    cardOffsetY: -70,
    cardTargetIndex: 0,
    callouts: [
      {
        text: '查看',
        bubbleAnchor: 'bottom',
        bubbleOffsetX: -100,
        bubbleOffsetY: 30,
        lineFrom: 'right',
        lineTo: 'bottom',
        targetIndex: 0,
      },
      {
        text: '新增',
        bubbleAnchor: 'bottom',
        bubbleOffsetX: 0,
        bubbleOffsetY: 80,
        lineFrom: 'top',
        lineTo: 'bottom',
        targetIndex: 1,
      },
    ],
  },
  {
    id: 'day-switch',
    targets: [{ id: 'day-switch', padding: 8, radius: 12 }],
    title: '快速查看',
    description: '一鍵切換\n立即查看今天與明天的穿搭',
    cardAnchor: 'bottom',
    cardOffsetX: 50,
    cardOffsetY: 20,
    cardTargetIndex: 0,
  },
  {
    id: 'settings',
    targets: [{ id: 'settings', padding: 0, radius: 999 }],
    title: '設定',
    description: '依照需求設定場合、風格與色系\n讓每次推薦都更精準',
    cardAnchor: 'top',
    cardOffsetX: -160,
    cardOffsetY: -20,
    cardTargetIndex: 0,
  },
]
