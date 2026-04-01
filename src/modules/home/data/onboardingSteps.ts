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

export type OnboardingLinePath = {
  d: string
  width: number
  height: number
  rotate?: number
}

export type OnboardingCallout = {
  text: string
  bubblePlacement: OverlayPlacement
  linePlacement?: OverlayPlacement
  linePath?: OnboardingLinePath
}

export type OnboardingStepProps = {
  id: string
  title: string
  description: string
  targets: SpotlightTarget[]
  cardPlacement: OverlayPlacement
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
    cardPlacement: { top: 81, left: 67 },
    callouts: [
      {
        text: '設定裡也可以更改場合',
        bubblePlacement: { right: 93, bottom: 105 },
        linePlacement: { right: 33, bottom: 80 },
        linePath: {
          d: 'M1.49962 1.49958C31.161 2.42359 38.645 12.1662 39.545 42.1097',
          width: 42,
          height: 44,
        },
      },
    ],
  },
  {
    id: 'like',
    targets: [{ id: 'like', padding: 0, radius: 999 }],
    title: '喜歡這套穿搭？',
    description: '按 ❤️ 即可收藏到「我的穿搭」',
    cardPlacement: { top: 248, left: 62 },
    callouts: [
      {
        text: '喜歡',
        bubblePlacement: { right: 53, bottom: 480 },
        linePlacement: { right: 40, bottom: 430 },
        linePath: {
          d: 'M1.5 1.5C29.1954 1.5 48.7184 1.5 80.5 1.5',
          width: 82,
          height: 3,
          rotate: 90,
        },
      },
    ],
  },
  {
    id: 'dislike',
    targets: [{ id: 'dislike', padding: 0, radius: 999 }],
    title: '不喜歡這套穿搭...',
    description: '按 ✖，讓 Closy 調整推薦方向',
    cardPlacement: { top: 340, left: 63 },
    callouts: [
      {
        text: '不喜歡',
        bubblePlacement: { right: 100, bottom: 345 },
        linePlacement: { right: 180, bottom: 360 },
        linePath: {
          d: 'M1.5 1.5C29.1954 1.5 48.7184 1.5 80.5 1.5',
          width: 82,
          height: 3,
        },
      },
    ],
  },
  {
    id: 'calendar',
    targets: [{ id: 'calendar-card', padding: 0, radius: 16 }],
    title: '行事曆',
    description:
      '連結 Google 行事曆，記錄每個場合\n快速回顧過去同樣場合的穿搭\n更輕鬆選擇今天要穿什麼',
    cardPlacement: { top: 340, left: 63 },
    callouts: [
      {
        text: '查看',
        bubblePlacement: { left: 62, bottom: 155 },
        linePlacement: { left: 125, bottom: 170 },
        linePath: {
          d: 'M1.49962 1.49958C31.161 2.42359 38.645 12.1662 39.545 42.1097',
          width: 42,
          height: 44,
          rotate: 85,
        },
      },
      {
        text: '新增',
        bubblePlacement: { right: 25, bottom: 98 },
        linePlacement: { right: 15, bottom: 175 },
        linePath: {
          d: 'M1.5 1.5C29.1954 1.5 48.7184 1.5 80.5 1.5',
          width: 82,
          height: 3,
          rotate: 90,
        },
      },
    ],
  },
  {
    id: 'day-switch',
    targets: [{ id: 'day-switch', padding: 8, radius: 12 }],
    title: '快速查看',
    description: '一鍵切換\n立即查看今天與明天的穿搭',
    cardPlacement: { top: 84, left: 73 },
  },
  {
    id: 'settings',
    targets: [{ id: 'settings', padding: 0, radius: 999 }],
    title: '設定',
    description: '依照需求設定場合、風格與色系\n讓每次推薦都更精準',
    cardPlacement: { right: 50, bottom: 124 },
  },
]
