# 👕 Closy-穿搭小助手

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![PWA](https://img.shields.io/badge/PWA-next--pwa-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)

Closy 是一個以 **mobile-first、App-like 體驗** 為核心的 AI 穿搭與智慧衣櫃管理專案。

使用者可以透過引導流程建立個人偏好，管理自己的衣櫃，並依照天氣、場合、行事曆情境與穿搭偏好，取得每日穿搭推薦。專案同時整合 Google OAuth、Google Calendar 情境流程、Redux Persist 狀態保存、Next.js API Routes 與 PWA 設定，讓整體體驗更接近行動 App。

---

## 👀 專案預覽 | Project Preview

![總覽](./public/readme/readme-banner.png)

---

## 🛠 使用技術 | Technical Stack

- **核心框架 (Core)**：Next.js 16.1.6、React 19.2.3
- **開發語言 (Language)**：TypeScript
- **樣式處理 (Styling)**：Tailwind CSS v4、tw-animate-css
- **狀態管理 (State Management)**：Redux Toolkit、React Redux、Redux Persist
- **身份驗證 (Authentication)**：Google OAuth
- **PWA 支援 (PWA Support)**：@ducanh2912/next-pwa
- **UI / Interaction**：Radix UI、Vaul、Sonner、Lucide React、Hugeicons
- **工具函式 (Utilities)**：clsx、tailwind-merge、class-variance-authority
- **程式碼規範 (Code Quality)**：ESLint、Prettier、prettier-plugin-tailwindcss

---

## ✨ 核心功能 | Features

### 🧭 Guide 初始引導流程

使用者初次進入 App 時，會透過引導流程建立基本資料與穿搭偏好，讓後續推薦結果更符合個人需求。

主要功能包含：

- Google 登入流程
- 初始歡迎與導覽
- 性別設定
- 預設場合設定
- 位置服務設定
- Google Calendar 整合設定
- 初始衣物新增（上衣 / 下身）
- 使用者資料完成狀態判斷

---

### 🏠 首頁每日穿搭推薦

首頁會顯示今日與明日的穿搭建議，讓使用者快速完成每日穿搭決策。

主要功能包含：

- 今日穿搭推薦
- 明日穿搭推薦
- 天氣資訊顯示
- 喜歡 / 不喜歡穿搭
- 穿搭收藏
- 穿搭調整入口
- 載入、錯誤與空狀態處理

---

### 💬 穿搭調整流程

使用者可以透過調整視窗描述想要修改的方向，例如保留某件單品、改成正式一點、換成褲裝等，讓 AI 穿搭結果更貼近日常需求。

主要功能包含：

- AI小助手 調整視窗
- 調整次數規則
- 調整內容輸入
- 調整結果顯示
- 對話框與結果頁轉場體驗

---

### 👚 我的衣櫃

使用者可以管理自己的衣物資料，建立個人化衣櫃，作為 AI 推薦穿搭的基礎。

主要功能包含：

- 衣物列表
- 新增衣物（相機拍照 / 相簿選取 → 預覽 → AI 辨識 → 結果審核）
- 衣物詳細頁
- 編輯衣物資料
- 衣物圖片顯示
- 衣物屬性與標籤管理

---

### 🧥 我的穿搭

使用者可以查看已收藏或產生過的穿搭，建立自己的穿搭紀錄。

主要功能包含：

- 穿搭列表
- 穿搭詳情
- 穿搭收藏狀態
- 依場合或資料狀態顯示穿搭內容

---

### 📅 行事曆情境搭配

專案整合行事曆情境，讓穿搭建議可以更貼近使用者當天的活動與場合需求。

主要功能包含：

- 行事曆頁面
- 新增行程與場合設定
- 行程情境顯示
- 場合穿搭挑選流程
- 行程詳細資訊顯示

---

### ⚙️ 設定與偏好調整

使用者可以在設定頁管理自己的預設場合、風格偏好與顏色偏好，讓推薦結果更個人化。

主要功能包含：

- 設定首頁
- 預設場合設定
- 風格偏好設定
- 顏色偏好設定
- 登出流程

---

### 📱 PWA 支援

專案已加入 PWA 基本設定，支援更接近 App 的使用體驗。

主要功能包含：

- Web App Manifest
- Service Worker
- 離線頁面 fallback
- Next image runtime cache
- Cloudinary 圖片來源支援
- 中央氣象署天氣 icon 圖片來源支援

---

## 📂 專案架構 | Project Architecture

專案採用 Next.js Pages Router，並以 `src/modules` 管理各功能模組。  
`page` 層負責路由入口、頁面組裝與資料流協調；`modules` 負責各功能區塊的元件、型別與邏輯；`store` 負責跨頁狀態管理。

```text
closy/
├─ public/                         # 靜態資源、PWA manifest、favicon、離線頁資源
│
├─ src/
│  ├─ pages/                       # Next.js Pages Router 路由入口
│  │  ├─ api/                      # API Routes，作為前端與後端 API 的橋接
│  │  ├─ _app.tsx                  # App 初始化、Redux、Google OAuth、路由保護
│  │  ├─ _document.tsx             # Document 設定
│  │  └─ _offline.tsx              # PWA 離線 fallback 頁面
│  │
│  ├─ modules/                     # 功能模組
│  │  ├─ home/                     # 首頁、每日穿搭推薦、天氣卡片、穿搭互動
│  │  ├─ guide/                    # 初始引導、登入引導、偏好建立
│  │  ├─ wardrobe/                 # 我的衣櫃、衣物新增、衣物詳細、衣物編輯
│  │  ├─ outfit/                   # 我的穿搭、穿搭詳情、場合分類
│  │  ├─ settings/                 # 設定頁、預設場合、風格與顏色偏好
│  │  ├─ calendar/                 # 行事曆、行程情境搭配
│  │  └─ common/                   # 跨功能共用版型與 domain 元件
│  │
│  ├─ components/
│  │  └─ ui/                       # shadcn/ui 基礎元件與客製 UI 元件
│  │
│  ├─ store/                       # Redux Toolkit 狀態管理
│  │  ├─ slices/                   # userSlice、homeSlice、outfitSlice
│  │  ├─ hooks.ts                  # useAppDispatch、useAppSelector
│  │  └─ index.ts                  # store 與 redux-persist 設定
│  │
│  ├─ lib/
│  │  ├─ api/                      # API client、型別定義、domain 共用 API 邏輯
│  │  ├─ utils.ts
│  │  ├─ date.ts
│  │  ├─ weather.ts
│  │  └─ font.ts
│  └─ styles/                      # globals.css 與全域樣式
│
├─ next.config.ts                  # Next.js、Image remote patterns、PWA 設定
├─ tsconfig.json                   # TypeScript 設定與 @/* alias
├─ eslint.config.mjs               # ESLint 設定
├─ package.json                    # 專案依賴與 scripts
└─ README.md                       # 專案說明文件
```
