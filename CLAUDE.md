# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

Closy 是一個以行動端體驗為主的穿搭與衣櫃管理專案，功能包含：guide 初始引導、衣櫃管理、每日穿搭推薦、我的穿搭、行事曆情境搭配、設定與偏好調整。整體以 mobile-first、App-like 體驗為優先。

## Commands

```bash
npm run dev          # 啟動開發伺服器 localhost:3000
npm run build        # 正式建置
npm run lint         # 執行 ESLint
npm run lint:fix     # ESLint 自動修正
npm run format       # Prettier 格式化
npm run format:check # 檢查格式
```

## 技術棧

- **Next.js 16**（Pages Router，非 App Router）
- **React 19** + **TypeScript**
- **Tailwind CSS v4** — 無 `tailwind.config.js`，設定在 `globals.css`
- **Redux Toolkit** + **redux-persist** — 單一 `userSlice`，typed hooks 在 `src/store/hooks.ts`
- **shadcn/ui** + **Radix UI**
- **@react-oauth/google**

## 架構

### 資料夾結構

```
src/
  pages/          # 路由進入點與頁面組裝
    api/          # BFF proxy routes — 附帶 auth cookie 後轉發至 backend
  modules/        # 功能模組
    home/         # 首頁
    guide/        # 初始引導、登入、偏好建立
    wardrobe/     # 我的衣櫃
    outfit/       # 我的穿搭、穿搭詳情、場合分類
    settings/     # 設定
    calendar/     # 行事曆
    common/       # 跨功能共用元件與 domain 型別
  store/
    slices/userSlice.ts
    hooks.ts      # useAppDispatch、useAppSelector（一律用這個，不用 raw hooks）
  lib/
    api/client.ts # 基礎 fetch wrapper（apiClient），失敗時拋出 ApiError
  components/ui/  # shadcn/ui 基礎元件與客製版本
  styles/         # 全域樣式
```

### API Pattern（BFF Proxy）

所有 API 呼叫都透過 `src/pages/api/` 轉發，由 route handler 附加 httpOnly cookie `accessToken` 後再打 backend。Client 端永遠不直接呼叫 backend。

流程：`Component → src/modules/[feature]/api/*.ts → /api/[route].ts → backend`

API 邏輯需清楚區分：request function / route handler / state update / UI rendering。loading、empty、error state 要明確處理。

### Auth 流程

1. Google OAuth → `POST /api/guide/login` → token 存為 httpOnly cookie `accessToken`
2. `dispatch(setUser(result.user))` 存入 Redux（登入 response **不含** `preferences`）
3. 進入 settings 頁 → `GET /api/profile/get-info` → `dispatch(mergeUserProfile(data))` 補入 `preferences`、`gender`、`location`

### Redux State

只有一個 slice：`userSlice`。一律使用 `src/store/hooks.ts` 的 `useAppDispatch` 和 `useAppSelector`。

Key actions：
- `setUser` — 登入後呼叫（payload 不含 preferences）
- `mergeUserProfile` — fetch profile 後呼叫（合併 preferences / gender / location）。**`state.user` 為 null 時也能執行**，不會被 guard 擋住
- `updateUserOccasion / updateUserStyles / updateUserColors` — 設定儲存後呼叫
- `clearUser` — 登出時呼叫，清除 Redux 與 localStorage 快取

**持久化：** `redux-persist` 已設定，`user` 和 `isLoggedIn` 會存在 `localStorage`，重整後自動還原。`_app.tsx` 用 `PersistGate` 包裹，還原完成前不渲染子元件。

**Settings 頁資料流：**
1. 進頁面時 Redux 立刻從 localStorage 還原舊資料 → UI 先顯示快取
2. `useEffect` 背景打 `GET /api/profile/get-info` → `dispatch(mergeUserProfile(data))` 更新為最新資料
3. fetch 失敗（401）→ `router.push('/')` 導回登入頁

### 元件與狀態切分

- `page` 層負責頁面組裝、狀態協調、資料流控制
- `module` 內元件負責該功能範圍的 UI 與互動
- presentational component 盡量保持純渲染與事件回傳
- 單頁暫時狀態留在 page 或 feature container，跨頁共用再考慮放 Redux

### UI / UX 原則

畫面應接近原生 App。注意：sticky header、bottom nav、drawer/dialog/overlay、可點擊範圍、scroll 區域切分、mobile viewport 高度分配。

- 主 nav 頁面使用 `<AppShell activeTab="...">` 包裹（含 bottom nav）
- settings 子頁面（colors、styles、occasion）使用 `<SettingsHeader>` 不套 AppShell
- `MobileLayout`（`_app.tsx`）限制最大寬度

### Tailwind Arbitrary Values

**禁止**動態拼接 Tailwind class（例如 `` `bg-[${color}]` ``）。JIT scanner 只掃描原始碼中完整出現的 class 字串。改用 `style={{ backgroundColor: color }}` 或在 data map 裡預先寫好完整 class 字串。

### Enum ↔ Label 轉換

API 回傳英文 key（`socialGathering`、`simple`、`black`），UI 顯示中文 label。渲染前必須用 label map 轉換：

- `occasionLabelMap` — `src/modules/common/types/occasion.ts`
- `stylesLabelMap` — `src/modules/settings/types/stylesTypes.ts`
- `colorsLabelMap` — `src/modules/settings/types/colorsTypes.ts`

### Wardrobe Creation Flow

多步驟流程（camera → preview → processing → review → complete）透過 `sessionStorage` 跨頁保存狀態，實作在 `src/modules/wardrobe/utils/creationFlowStorage.ts`。進入點由 `entryScope` query param 追蹤。

## TypeScript 規則

- 優先使用明確型別，避免濫用 `any`
- 不要用型別斷言掩蓋資料結構問題
- 共用型別放在對應 module 的 `types/`

## 命名原則

- callback props：`onClick`、`onChange`、`onSubmit`、`onClose`、`onOpenChange`、`onValueChange`
- 布林值：`is...`、`has...`、`should...`

## 語言規則

- 一般說明、建議、PR description：繁體中文
- commit message：英文
- PR title：分支名稱首字母大寫（`feature/home-page` → `Feature/home-page`）

## Branch 規則

格式：`feature/`、`update/`、`fix/`、`hotfix/`、`chore/`、`docs/` + 小寫英文單字以 `-` 連接，名稱對應實際功能。

## Commit 規則

格式：`type: message`

允許類別：`feat`、`update`、`fix`、`style`、`perf`、`chore`、`refactor`、`docs`

- 英文、小寫、簡潔明確、不加句點
- 範例：`feat: add outfit detail page`、`fix: restore outfitImageUrl props in adjust drawer`

## PR 規則

- title：分支名稱首字母大寫
- description：繁體中文，說明新增什麼、調整什麼、修正什麼、影響哪些頁面或元件

## 協作原則

- 先看現有結構再給建議，優先延續現有命名與實作模式
- 不要無故大改架構或重寫整個檔案
- 若使用者要意見，不要直接改 code
- UI 問題優先考慮 mobile UX
- API 問題優先考慮既有 route / client / Redux 流程
