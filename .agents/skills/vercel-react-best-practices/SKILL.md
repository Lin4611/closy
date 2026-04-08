---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React 最佳實踐

由 Vercel 維護的 React 與 Next.js 應用程式效能優化指南。涵蓋 8 大類別共 69 條規則，依影響程度排序，以引導自動化重構與程式碼生成。

## 適用時機

在以下情況時參考這些指南：
- 撰寫新的 React 元件或 Next.js 頁面
- 實作資料獲取（客戶端或伺服器端）
- 審查程式碼是否有效能問題
- 重構現有的 React/Next.js 程式碼
- 優化打包大小或載入時間

## 規則分類（依優先級排序）

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls（消除瀑布式請求） | CRITICAL | `async-` |
| 2 | Bundle Size Optimization（打包大小優化） | CRITICAL | `bundle-` |
| 3 | Server-Side Performance（伺服器端效能） | HIGH | `server-` |
| 4 | Client-Side Data Fetching（客戶端資料獲取） | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization（重新渲染優化） | MEDIUM | `rerender-` |
| 6 | Rendering Performance（渲染效能） | MEDIUM | `rendering-` |
| 7 | JavaScript Performance（JavaScript 效能） | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns（進階模式） | LOW | `advanced-` |

## 快速參考

### 1. 消除瀑布式請求（CRITICAL）

- `async-cheap-condition-before-await` - 在 await 旗標或遠端值之前先檢查成本低廉的同步條件
- `async-defer-await` - 將 await 移至實際使用的分支中
- `async-parallel` - 對獨立操作使用 Promise.all()
- `async-dependencies` - 對部分依賴使用 better-all
- `async-api-routes` - 在 API routes 中儘早啟動 Promise，延遲 await
- `async-suspense-boundaries` - 使用 Suspense 串流傳輸內容

### 2. 打包大小優化（CRITICAL）

- `bundle-barrel-imports` - 直接引入，避免使用 barrel 檔案
- `bundle-dynamic-imports` - 對大型元件使用 next/dynamic
- `bundle-defer-third-party` - 在 hydration 後才載入分析/日誌工具
- `bundle-conditional` - 僅在功能啟動時才載入模組
- `bundle-preload` - 在 hover/focus 時預載以提升感知速度

### 3. 伺服器端效能（HIGH）

- `server-auth-actions` - 像 API routes 一樣驗證 server actions
- `server-cache-react` - 使用 React.cache() 進行單次請求去重複
- `server-cache-lru` - 使用 LRU cache 進行跨請求快取
- `server-dedup-props` - 避免在 RSC props 中重複序列化
- `server-hoist-static-io` - 將靜態 I/O（字型、圖示）提升至模組層級
- `server-no-shared-module-state` - 避免在 RSC/SSR 中使用模組層級的可變請求狀態
- `server-serialization` - 最小化傳遞給客戶端元件的資料量
- `server-parallel-fetching` - 重構元件結構以並行化資料獲取
- `server-parallel-nested-fetching` - 在 Promise.all 中對每個項目串接巢狀獲取
- `server-after-nonblocking` - 使用 after() 處理非阻塞操作

### 4. 客戶端資料獲取（MEDIUM-HIGH）

- `client-swr-dedup` - 使用 SWR 自動去除重複請求
- `client-event-listeners` - 去除重複的全域事件監聽器
- `client-passive-event-listeners` - 對捲動使用 passive 監聽器
- `client-localstorage-schema` - 對 localStorage 資料進行版本控制並最小化

### 5. 重新渲染優化（MEDIUM）

- `rerender-defer-reads` - 不要訂閱僅在回呼中使用的狀態
- `rerender-memo` - 將耗費資源的工作提取到記憶化元件中
- `rerender-memo-with-default-value` - 提升預設的非原始型別 props
- `rerender-dependencies` - 在 effects 中使用原始型別依賴
- `rerender-derived-state` - 訂閱衍生的布林值，而非原始值
- `rerender-derived-state-no-effect` - 在渲染期間衍生狀態，而非在 effects 中
- `rerender-functional-setstate` - 使用函式型 setState 以獲得穩定的回呼
- `rerender-lazy-state-init` - 對耗費資源的初始值傳遞函式給 useState
- `rerender-simple-expression-in-memo` - 對簡單原始型別避免使用 memo
- `rerender-split-combined-hooks` - 拆分具有獨立依賴的 hooks
- `rerender-move-effect-to-event` - 將互動邏輯放在事件處理器中
- `rerender-transitions` - 對非緊急更新使用 startTransition
- `rerender-use-deferred-value` - 延遲耗費資源的渲染以保持輸入響應性
- `rerender-use-ref-transient-values` - 對頻繁變動的暫態值使用 refs
- `rerender-no-inline-components` - 不要在元件內部定義元件

### 6. 渲染效能（MEDIUM）

- `rendering-animate-svg-wrapper` - 對 div 包裝器而非 SVG 元素設定動畫
- `rendering-content-visibility` - 對長列表使用 content-visibility
- `rendering-hoist-jsx` - 將靜態 JSX 提取到元件外部
- `rendering-svg-precision` - 降低 SVG 座標精度
- `rendering-hydration-no-flicker` - 對客戶端資料使用 inline script 避免閃爍
- `rendering-hydration-suppress-warning` - 抑制預期的不匹配警告
- `rendering-activity` - 使用 Activity 元件控制顯示/隱藏
- `rendering-conditional-render` - 使用三元運算子，而非 && 進行條件渲染
- `rendering-usetransition-loading` - 優先使用 useTransition 處理載入狀態
- `rendering-resource-hints` - 使用 React DOM resource hints 進行預載
- `rendering-script-defer-async` - 對 script 標籤使用 defer 或 async

### 7. JavaScript 效能（LOW-MEDIUM）

- `js-batch-dom-css` - 透過 class 或 cssText 批次處理 CSS 變更
- `js-index-maps` - 對重複查找建立 Map
- `js-cache-property-access` - 在迴圈中快取物件屬性
- `js-cache-function-results` - 在模組層級的 Map 中快取函式結果
- `js-cache-storage` - 快取 localStorage/sessionStorage 的讀取
- `js-combine-iterations` - 將多個 filter/map 合併為單一迴圈
- `js-length-check-first` - 在進行耗費資源的比較前先檢查陣列長度
- `js-early-exit` - 從函式中提早返回
- `js-hoist-regexp` - 將 RegExp 建立提升到迴圈外部
- `js-min-max-loop` - 使用迴圈而非排序求最大/最小值
- `js-set-map-lookups` - 使用 Set/Map 達到 O(1) 查找複雜度
- `js-tosorted-immutable` - 使用 toSorted() 保持不可變性
- `js-flatmap-filter` - 使用 flatMap 在單次遍歷中完成 map 與 filter
- `js-request-idle-callback` - 將非關鍵工作延遲至瀏覽器閒置時處理

### 8. 進階模式（LOW）

- `advanced-effect-event-deps` - 不要將 `useEffectEvent` 的結果放入 effect 依賴
- `advanced-event-handler-refs` - 將事件處理器儲存在 refs 中
- `advanced-init-once` - 每次應用程式載入只初始化一次
- `advanced-use-latest` - 使用 useLatest 獲得穩定的回呼 refs

## 使用方式

閱讀個別規則檔案以取得詳細說明和程式碼範例：

```
rules/async-parallel.md
rules/bundle-barrel-imports.md
```

每個規則檔案包含：
- 說明此規則重要性的簡短解釋
- 附有說明的錯誤程式碼範例
- 附有說明的正確程式碼範例
- 額外背景說明與參考資料

## 完整彙編文件

包含所有規則展開的完整指南：`AGENTS.md`
