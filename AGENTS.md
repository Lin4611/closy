# AGENTS.md

## 專案概述

Closy 是一個以行動端體驗為主的穿搭與衣櫃管理專案，重點功能包含：

- guide 初始引導流程
- 衣櫃管理
- 每日穿搭推薦
- 我的穿搭與穿搭詳情
- 行事曆情境搭配
- 設定與偏好調整

整體應以 mobile-first、App-like 體驗為優先。

## 技術棧

- Next.js (Page Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Redux Toolkit + redux-persist
- date-fns
- react-dropzone
- next-pwa

## 開發原則

- 優先延續現有專案結構、命名與實作模式。
- 優先依照 Figma 的資訊層級、互動流程與視覺一致性實作。
- 不要無故大改架構或重寫整個檔案。
- review 時先給局部、可執行的建議。
- 所有建議都要以目前專案可落地為前提。

## 語言規則

- 一般說明、建議、PR 內容：繁體中文
- commit message：英文
- PR title：依分支名稱產生，第一個字母大寫
  - `feature/home-page` -> `Feature/home-page`
  - `fix/login-api-error` -> `Fix/login-api-error`

## UI / UX 原則

- 一律優先考慮手機版操作與版面。
- 畫面應接近原生 App，而不是傳統桌機網站。
- 注意：
  - sticky header
  - bottom nav
  - drawer / dialog / overlay
  - 可點擊範圍
  - scroll 區域切分
  - mobile viewport 高度分配
- 不要加入不必要的複雜互動。

## TypeScript 規則

- 優先使用明確型別，避免濫用 `any`
- props、API response、Redux state、domain type 盡量明確
- 共用型別放在對應 module 的 `types`
- 不要用型別斷言掩蓋資料結構問題

## 元件與狀態切分

- page 層負責頁面組裝、狀態協調、資料流控制
- module 內元件負責該功能範圍的 UI 與互動
- `src/components/ui/` 放 shadcn/ui 安裝進來與客製後的基礎 UI 元件
- 不要太早抽象化
- presentational component 應盡量保持純渲染與事件回傳
- 單頁暫時狀態優先留在 page 或 feature container
- 跨頁共用或使用者偏好再考慮放 Redux Toolkit

## API 與資料流

- API 邏輯需清楚區分：
  - request function
  - route handler
  - state update
  - UI rendering
- 優先沿用既有 API client、錯誤處理與 Redux 流程
- loading / empty / error state 要明確
- 新增 API route 時，維持 pages API 既有風格

## Redux 與持久化

- 只有一個 slice：`userSlice`（`src/store/slices/userSlice.ts`）
- 一律使用 `useAppDispatch`、`useAppSelector`（`src/store/hooks.ts`），不用 raw hooks
- `redux-persist` 已設定，`user` 和 `isLoggedIn` 持久化至 `localStorage`，重整後自動還原
- `_app.tsx` 以 `PersistGate` 包裹，確保還原完成後才渲染

**Key actions：**
- `setUser` — 登入後呼叫（payload 不含 preferences）
- `mergeUserProfile` — 進 settings 頁背景 fetch 後呼叫，`state.user` 為 null 時也可執行
- `updateUserOccasion / updateUserStyles / updateUserColors` — 設定儲存後呼叫
- `clearUser` — 登出時呼叫

**Settings 頁資料流：**
1. 進頁面 → Redux 從 localStorage 還原快取 → UI 立刻顯示
2. `useEffect` 背景打 `GET /api/profile/get-info` → `dispatch(mergeUserProfile(data))` 更新最新資料
3. fetch 失敗（401）→ `router.push('/')` 導回登入頁

**Enum ↔ Label 轉換：** API 回傳英文 key，UI 顯示中文 label，渲染前用 label map 轉換：
- `occasionLabelMap` — `src/modules/common/types/occasion.ts`
- `stylesLabelMap` — `src/modules/settings/types/stylesTypes.ts`
- `colorsLabelMap` — `src/modules/settings/types/colorsTypes.ts`

## 資料夾規則

- `src/pages/`：route entry 與 page orchestration
- `src/components/ui/`：shadcn/ui 基礎元件與客製版本
- `src/modules/home/`：首頁相關
- `src/modules/guide/`：初始引導、登入引導、偏好建立
- `src/modules/wardrobe/`：我的衣櫃
- `src/modules/outfit/`：我的穿搭、穿搭詳情、場合分類
- `src/modules/settings/`：設定
- `src/modules/calendar/`：行事曆
- `src/modules/common/`：跨功能共用版型或 domain 元件
- `src/lib/`：api client、utils、helper、font
- `src/styles/`：全域樣式

## 命名原則

- 命名要清楚、可讀、語意明確
- callback props 優先使用：
  - `onClick`
  - `onChange`
  - `onSubmit`
  - `onClose`
  - `onOpenChange`
  - `onValueChange`
- 布林值優先使用：
  - `is...`
  - `has...`
  - `should...`

## Branch 規則

使用以下格式：

- `feature/[branch-name]`
- `update/[branch-name]`
- `fix/[branch-name]`
- `hotfix/[branch-name]`
- `chore/[branch-name]`
- `docs/[branch-name]`

規則：

- 小寫英文
- 單字以 `-` 連接
- 名稱需對應實際功能

## Commit 規則

格式：

`type: message`

允許類別：

- `feat`
- `update`
- `fix`
- `style`
- `perf`
- `chore`
- `refactor`
- `docs`

規則：

- 英文
- 小寫
- 簡潔明確
- 不加句點
- 對應實際功能、元件或頁面

範例：

- `feat: add outfit detail page and navigation flow`
- `update: refine onboarding overlay spacing`
- `fix: restore outfitImageUrl and outfitId props in adjust drawer`

## PR 規則

- PR title 使用分支名稱，並將第一個字母大寫
- PR description 使用繁體中文
- 內容聚焦本次改動，清楚說明：
  - 新增什麼
  - 調整什麼
  - 修正什麼
  - 影響哪些頁面或元件

## 協助這個 repo 時

- 先看現有結構再給建議
- 優先給符合目前 repo 脈絡的做法
- 若使用者是要意見，不要直接大改 code
- UI 問題優先考慮 mobile UX
- API 問題優先考慮既有 route / client / redux 流程
- commit / PR / branch 命名要符合團隊規範
