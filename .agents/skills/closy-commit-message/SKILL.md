---
name: closy-commit-message
description: '根據 Closy 專案的 commit 規範，為目前改動產生英文 commit message，格式必須為 type: message，並符合 repo 既有語氣。'
---

# Closy Commit Message Skill

## 目的

依照 Closy 專案規範，為目前改動產生合適的 commit message。

commit message 必須：

- 使用英文
- 使用小寫
- 格式固定為 `type: message`
- `:` 後面要有一個空格
- 不可句點結尾
- 要簡潔、明確，能對應實際改動
- 盡量貼近目前 repo 的 commit 語氣

## 何時使用

在以下情況使用這個 skill：

- 使用者要你幫忙想 commit message
- 使用者貼出改動內容，想知道這次 commit 怎麼下
- 使用者不確定該用 `feat`、`update`、`fix` 還是 `refactor`
- 使用者希望 commit 訊息符合 Closy 專案既有風格
- 使用者想要 1 個最佳版本加上 2 到 3 個備選

不要在以下情況使用：

- 使用者要的是 PR title
- 使用者要的是 PR description
- 使用者要的是 branch name
- 使用者要的是 release note 或 changelog
- 使用者是要你直接改 code，不是要命名 commit

## Closy 專案 commit 規則

格式固定為：

`type: message`

允許類別只有：

- `feat`
- `update`
- `fix`
- `style`
- `perf`
- `chore`
- `refactor`
- `docs`

## 類別判斷規則

### feat

用於新增功能、新頁面、新流程、新 API route、新元件能力。

適用例子：

- 新增穿搭詳細頁
- 新增 drawer 流程
- 新增 onboarding / guide 功能
- 新增 API route 串接能力

常見寫法：

- `feat: add ...`
- `feat: implement ...`
- `feat: connect ...`

### update

用於既有功能的調整、優化、UI/UX 微調、互動行為改善，但不是全新功能。

適用例子：

- 調整按鈕尺寸
- 微調 spacing
- 改善互動流程
- 優化既有頁面呈現

常見寫法：

- `update: adjust ...`
- `update: refine ...`
- `update: improve ...`

### fix

用於修 bug、修錯誤資料、修 props、修 state 問題、修 import/path/build 問題。

適用例子：

- 修正錯誤 props 傳遞
- 修正 deploy build 問題
- 修正 state 沒 reset
- 修正 API request body parsing

常見寫法：

- `fix: resolve ...`
- `fix: restore ...`
- `fix: reset ...`

### style

只用於純樣式、排版、視覺微調，且不影響功能邏輯。

適用例子：

- 純版面微調
- 對齊設計稿的視覺調整
- 字距、間距、陰影等調整

常見寫法：

- `style: polish ...`
- `style: align ...`

### perf

只用於效能改善。

### chore

用於工具、依賴、環境、設定、安裝、非功能邏輯維護。

適用例子：

- 安裝套件
- 調整 lint / build / config
- 加入基礎工具檔案

### refactor

用於重構，前提是「不改變原本預期功能」。

適用例子：

- 調整資料夾結構
- 抽離共用邏輯
- 重整檔案命名
- 將 state 從 child 移到 page/container

常見寫法：

- `refactor: move ...`
- `refactor: group ...`
- `refactor: rename ...`
- `refactor: centralize ...`

### docs

只用於文件。

## Closy 專案語氣規則

產出的 commit message 要貼近目前 repo 的風格，例如：

- `feat: add outfit detail page and navigation flow`
- `update: refine onboarding overlay spacing`
- `fix: restore outfitImageUrl and outfitId props in adjust drawer`
- `refactor: group outfit adjust drawer components into feature folder`

請遵守以下語氣：

- 優先描述實際功能區塊、頁面、元件、流程
- 優先使用具體動詞：
  - `add`
  - `implement`
  - `connect`
  - `adjust`
  - `refine`
  - `improve`
  - `restore`
  - `resolve`
  - `group`
  - `move`
  - `rename`
  - `centralize`
- 避免模糊訊息，例如：
  - `feat: change page`
  - `update: adjust code`
  - `fix: fix bug`
  - `refactor: update files`

## 分析改動時的判斷步驟

產生 commit message 前，請先做以下判斷：

1. 先找出這次改動的主要目的。
2. 若有多個改動，優先抓最主要的一個。
3. 判斷這是：
   - 新功能
   - 既有功能調整
   - bug 修正
   - 重構
   - 樣式微調
4. 盡量點出實際的功能範圍，例如：
   - home
   - guide
   - wardrobe
   - outfit
   - settings
   - calendar
   - api route
   - drawer
   - dialog
   - overlay
   - detail page
5. 若只是局部元件小調整，不要誇大成大型功能。

## 輸出規則

預設輸出格式如下：

Best:
`type: message`

Alternatives:

- `type: message`
- `type: message`
- `type: message`

Why:

- 用繁體中文簡短說明為什麼這次最適合這個 type

## 重要限制

- 不要捏造沒有改到的功能
- 不要把 bug fix 說成 `feat`
- 不要把純重構說成 `fix`
- 不要把有功能變更的內容誤判成 `style`
- 不要把明顯新增功能誤判成 `update`
- 不要輸出多行 commit body，除非使用者明確要求
- 若使用者只要一個 commit message，就只輸出最佳版本

## 範例

### 範例 1

改動：

- 新增穿搭詳細頁
- 串接 outfit card 點擊導頁

輸出：
Best:
`feat: add outfit detail page and navigation flow`

### 範例 2

改動：

- 微調 onboarding 卡片間距
- 修正進度點點數量顯示

輸出：
Best:
`update: refine onboarding overlay spacing`

Alternatives:

- `update: adjust onboarding progress dot rendering`
- `style: polish onboarding overlay layout`

### 範例 3

改動：

- 修正 adjust drawer 少傳 props
- 補回 outfitImageUrl 與 outfitId

輸出：
Best:
`fix: restore outfitImageUrl and outfitId props in adjust drawer`

### 範例 4

改動：

- 將 drawer state 從子元件移到 page 層
- 沒有改變原本功能

輸出：
Best:
`refactor: lift drawer state to page layer`

Alternatives:

- `refactor: move drawer state handling to page container`

### 範例 5

改動：

- 調整按鈕尺寸
- 調整間距與排版
- 無邏輯變更

輸出：
Best:
`update: adjust button size and spacing`

Alternatives:

- `style: polish button layout spacing`
