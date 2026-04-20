---
name: shadcn
description: 管理 shadcn 元件與專案 — 新增、搜尋、修復、除錯、設計樣式以及組合 UI。提供專案脈絡、元件文件及使用範例。適用於處理 shadcn/ui、元件註冊表 (registries)、預設集 (presets)、--preset 代碼，或任何具有 components.json 檔案的專案。同時也會在執行 "shadcn init"、"create an app with --preset" 或 "switch to --preset" 時觸發。
user-invocable: false
allowed-tools: Bash(npx shadcn@latest *), Bash(pnpm dlx shadcn@latest *), Bash(bunx --bun shadcn@latest *)
---

# shadcn/ui

用於建構 UI、元件及設計系統的框架。元件會透過 CLI 以原始碼的形式加入到使用者的專案中。

> **IMPORTANT（重要）：** 執行所有 CLI 指令時，請使用專案對應的套件執行器：`npx shadcn@latest`、`pnpm dlx shadcn@latest` 或 `bunx --bun shadcn@latest` — 會根據專案的 `packageManager` 而定。以下的範例使用 `npx shadcn@latest`，但請依照專案替換成正確的執行器。

## Current Project Context (目前專案脈絡)

```json
!`npx shadcn@latest info --json`
```

上方的 JSON 包含專案設定及目前已安裝的元件。使用 `npx shadcn@latest docs <component>` 可取得任何元件的文件和範例網址。

## Principles (設計原則)

1. **優先使用現有元件。** 在撰寫自訂 UI 之前，先使用 `npx shadcn@latest search` 檢查 registries (註冊表)。同時也請檢查社群 registries。
2. **組合而非重新發明。** 設定頁面 = Tabs + Card + 表單控制項。儀表板 = Sidebar + Card + Chart + Table。
3. **優先使用內建變體 (variants)，而非自訂樣式。** 例如 `variant="outline"`, `size="sm"` 等。
4. **使用語意化色彩 (semantic colors)。** 例如 `bg-primary`, `text-muted-foreground` — 絕對不要直接寫死顏色值，如 `bg-blue-500`。

## Critical Rules (關鍵規則)

這些規則是**強制執行**的。每一項都連結到一份包含錯誤/正確程式碼對照的檔案。

### Styling & Tailwind (樣式與 Tailwind) → [styling.md](./rules/styling.md)

- **`className` 用於排版，而非樣式。** 絕對不要覆蓋元件的顏色或排版字體 (typography)。
- **不使用 `space-x-*` 或 `space-y-*`。** 必須使用 `flex` 搭配 `gap-*`。對於垂直堆疊，請使用 `flex flex-col gap-*`。
- **當寬高相等時使用 `size-*`。** 寫 `size-10` 而不是 `w-10 h-10`。
- **使用 `truncate` 簡寫。** 不要寫 `overflow-hidden text-ellipsis whitespace-nowrap`。
- **不可手動覆寫 `dark:` 顏色。** 使用語意化的 token（如 `bg-background`, `text-muted-foreground`）。
- **條件式 class 請使用 `cn()`。** 不要手動寫樣板字面值 (template literal) 的三元運算子。
- **不可在覆蓋層元件上手動設定 `z-index`。** Dialog, Sheet, Popover 等元件會自行處理其堆疊層級。

### Forms & Inputs (表單與輸入框) → [forms.md](./rules/forms.md)

- **表單使用 `FieldGroup` + `Field`。** 絕對不要在表單排版中使用原始的 `div` 搭配 `space-y-*` 或 `grid gap-*`。
- **`InputGroup` 使用 `InputGroupInput`/`InputGroupTextarea`。** 在 `InputGroup` 內絕對不要使用原始的 `Input`/`Textarea`。
- **輸入框內的按鈕使用 `InputGroup` + `InputGroupAddon`。**
- **選項集 (2–7 個選項) 使用 `ToggleGroup`。** 不要使用 `Button` 跑迴圈並手動設定 active 狀態。
- **群組相關的複選框 (checkboxes) / 單選框 (radios) 使用 `FieldSet` + `FieldLegend`。** 不要使用帶有標題的 `div`。
- **欄位驗證使用 `data-invalid` + `aria-invalid`。** `Field` 上用 `data-invalid`，控制項上用 `aria-invalid`。對於禁用狀態：`Field` 用 `data-disabled`，控制項用 `disabled`。

### Component Structure (元件結構) → [composition.md](./rules/composition.md)

- **項目 (Items) 永遠放在它們的群組 (Group) 內。** `SelectItem` → `SelectGroup`。`DropdownMenuItem` → `DropdownMenuGroup`。`CommandItem` → `CommandGroup`。
- **自訂觸發器 (triggers) 請使用 `asChild` (radix) 或 `render` (base)。** 請檢查 `npx shadcn@latest info` 回傳的 `base` 欄位。→ [base-vs-radix.md](./rules/base-vs-radix.md)
- **Dialog, Sheet 和 Drawer 永遠需要 Title (標題)。** 為求無障礙 (accessibility)，必須使用 `DialogTitle`, `SheetTitle`, `DrawerTitle`。如果只是想在視覺上隱藏，請加上 `className="sr-only"`。
- **使用完整的 Card 組合。** 包含 `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`。不要把所有東西都塞到 `CardContent` 裡。
- **Button 沒有 `isPending`/`isLoading` 屬性。** 請使用 `Spinner` + `data-icon` + `disabled` 來組合。
- **`TabsTrigger` 必須放在 `TabsList` 裡。** 絕對不要在 `Tabs` 內直接渲染 triggers。
- **`Avatar` 永遠需要 `AvatarFallback`。** 以防圖片載入失敗。

### Use Components, Not Custom Markup (請使用元件，而非自訂標記) → [composition.md](./rules/composition.md)

- **在自訂標記前優先使用現有元件。** 在撰寫自帶樣式的 `div` 前，請先檢查是否已有該元件。
- **提示訊息 (Callouts) 使用 `Alert`。** 不要自行建立自帶樣式的 dive。
- **空狀態 (Empty states) 使用 `Empty`。** 不要自行建立空狀態的標記碼。
- **Toast 通知使用 `sonner`。** 使用來自 `sonner` 的 `toast()`。
- **分隔線使用 `Separator`。** 不要用 `<hr>` 或 `<div className="border-t">`。
- **載入佔位符使用 `Skeleton`。** 不要自訂 `animate-pulse` 的 divs。
- **標籤使用 `Badge`。** 而非自訂樣式的 spans。

### Icons (圖示) → [icons.md](./rules/icons.md)

- **`Button` 中的圖示使用 `data-icon`。** 在圖示上加上 `data-icon="inline-start"` 或 `data-icon="inline-end"`。
- **元件內的圖示不要加上尺寸 class。** 元件會透過 CSS 處理圖示大小。不可寫 `size-4` 或 `w-4 h-4`。
- **以物件形式傳遞圖示，而非字串鍵值。** 寫作 `icon={CheckIcon}`，而非字串查詢。

### CLI

- **絕對不要手動解析或抓取 preset 代碼。** 請直接將其傳遞給 `npx shadcn@latest init --preset <code>`。

## Key Patterns (關鍵模式)

以下是區分 shadcn/ui 正確程式碼的最常見模式。對於邊緣情況，請參見上方連結的規則檔案。

```tsx
// 表單排版：FieldGroup + Field，不是 div + Label。
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
</FieldGroup>

// 驗證狀態：Field 加上 data-invalid，控制項加上 aria-invalid。
<Field data-invalid>
  <FieldLabel>Email</FieldLabel>
  <Input aria-invalid />
  <FieldDescription>Invalid email.</FieldDescription>
</Field>

// 按鈕內的圖示：使用 data-icon，沒有尺寸 class。
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

// 間距：使用 gap-*，而不是 space-y-*。
<div className="flex flex-col gap-4">  // 正確
<div className="space-y-4">           // 錯誤

// 尺寸相等的寬高：使用 size-*，而不是 w-* h-*。
<Avatar className="size-10">   // 正確
<Avatar className="w-10 h-10"> // 錯誤

// 狀態顏色：使用 Badge 變體或語意化 tokens，而不是原始顏色。
<Badge variant="secondary">+20.1%</Badge>    // 正確
<span className="text-emerald-600">+20.1%</span> // 錯誤
```

## Component Selection (元件選擇)

| 需求                       | 使用元件                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| 按鈕/動作 (Button/action)              | 使用適當 variant 的 `Button`                                                                   |
| 表單輸入 (Form inputs)                | `Input`, `Select`, `Combobox`, `Switch`, `Checkbox`, `RadioGroup`, `Textarea`, `InputOTP`, `Slider` |
| 在2–5個選項間切換 (Toggle between 2–5 options) | `ToggleGroup` + `ToggleGroupItem`                                                                   |
| 資料顯示 (Data display)               | `Table`, `Card`, `Badge`, `Avatar`                                                                  |
| 導覽列 (Navigation)                 | `Sidebar`, `NavigationMenu`, `Breadcrumb`, `Tabs`, `Pagination`                                     |
| 覆蓋層 (Overlays)                   | `Dialog` (彈出視窗), `Sheet` (側邊面板), `Drawer` (底部面板), `AlertDialog` (確認對話框)       |
| 狀態回饋 (Feedback)                   | `sonner` (toast), `Alert`, `Progress`, `Skeleton`, `Spinner`                                        |
| 指令面板 (Command palette)            | `Command` (包在 `Dialog` 中)                                                                           |
| 圖表 (Charts)                     | `Chart` (包裝了 Recharts)                                                                            |
| 排版 (Layout)                     | `Card`, `Separator`, `Resizable`, `ScrollArea`, `Accordion`, `Collapsible`                          |
| 空狀態 (Empty states)               | `Empty`                                                                                             |
| 選單 (Menus)                      | `DropdownMenu`, `ContextMenu`, `Menubar`                                                            |
| 工具提示/資訊 (Tooltips/info)              | `Tooltip`, `HoverCard`, `Popover`                                                                   |

## Key Fields (各項關鍵欄位)

被注入的專案脈絡包含以下關鍵欄位：

- **`aliases`** → 請使用實際的別名前綴進行匯入（如 `@/`, `~/`），絕對不要寫死。
- **`isRSC`** → 當為 `true` 時，使用 `useState`, `useEffect`、事件處理器 (event handlers) 或瀏覽器 API 的元件需要在檔案最上方加入 `"use client"`。在建議加入該指令時請永遠參考此欄位。
- **`tailwindVersion`** → `"v4"` 使用 `@theme inline` 區塊；`"v3"` 使用 `tailwind.config.js`。
- **`tailwindCssFile`** → 這是定義自訂 CSS 變數的全域 CSS 檔案。請永遠修改這個檔案，絕對不要建立新的。
- **`style`** → 元件在視覺處理上的風格（如 `nova`, `vega`）。
- **`base`** → 基礎底層庫 (`radix` 或 `base`)。這會影響元件的 API 及可使用的 props。
- **`iconLibrary`** → 決定圖示的匯入方式。對 `lucide` 使用 `lucide-react`，對 `tabler` 使用 `@tabler/icons-react` 等。永遠不要預設為 `lucide-react`。
- **`resolvedPaths`** → 元件、utils、hooks 等資源確切在檔案系統中的目標位置。
- **`framework`** → 路由與檔案慣例（例如：Next.js App Router 對比 Vite SPA）。
- **`packageManager`** → 以此來安裝任何非 shadcn 的依賴套件（例如：`pnpm add date-fns` 還是 `npm install date-fns`）。

完整欄位參考請見 [cli.md — `info` command](./cli.md)。

## Component Docs, Examples, and Usage (元件文件、範例及用法)

執行 `npx shadcn@latest docs <component>` 以獲取某元件的文件、範例與 API 參考網址。請抓取 (Fetch) 這些網址內容以取得實際資訊。

```bash
npx shadcn@latest docs button dialog select
```

**當正在建立、修復、除錯或使用某個元件時，請永遠先執行 `npx shadcn@latest docs` 並獲取其網址內容。** 這能確保你使用的是正確的 API 與用法，而非憑空猜測。

## Workflow (工作流程)

1. **獲取專案脈絡 (Get project context)** — 已於上方注入。如果需要刷新，請再次執行 `npx shadcn@latest info`。
2. **優先檢查已安裝的元件 (Check installed components first)** — 在執行 `add` 前，請永遠先檢查專案脈絡中的 `components` 清單，或是列出 `resolvedPaths.ui` 裡面的目錄內容。不要匯入還沒被加入的元件，也不要重複加入已安裝的元件。
3. **尋找元件 (Find components)** — `npx shadcn@latest search`。
4. **獲取文件與範例 (Get docs and examples)** — 執行 `npx shadcn@latest docs <component>` 取得網址，然後抓取它們。使用 `npx shadcn@latest view` 來瀏覽你還沒安裝過的 registry 項目。如要預覽已安裝元件的變更，請使用 `npx shadcn@latest add --diff`。
5. **安裝或更新 (Install or update)** — `npx shadcn@latest add`。更新現有元件時，請先使用 `--dry-run` 和 `--diff` 預覽變更（請見下方的 [Updating Components](#updating-components)）。
6. **修正第三方元件中的匯入路徑 (Fix imports in third-party components)** — 在加入來自社群 registry（如 `@bundui`, `@magicui`）的元件後，需檢查被加入的非 UI 檔案是否有寫死匯入路徑（如 `@/components/ui/...`）。這些不一定會符合專案實際 alias。請使用 `npx shadcn@latest info` 獲取正確的 `ui` alias（如 `@workspace/ui/components`），並相應地重寫匯入。原版的 CLI 會對自己的 UI 檔案重寫匯入，但第三方的 registry 元件可能會使用預設路徑導致與專案不相符。
7. **檢查被加入的元件 (Review added components)** — 當從 registry 加入元件或區塊後，**請永遠閱讀被加入的檔案，並驗證其是否正確**。檢查是否有缺少的子元件（如只有 `SelectItem` 但缺少 `SelectGroup`）、缺少的匯入、錯誤的組合方式，或是違反 [Critical Rules](#critical-rules) 的情況。同時利用專案脈絡的 `iconLibrary` 替換圖示的匯入（例如，若 registry 項目使用了 `lucide-react` 但專案使用的是 `hugeicons`，請互換匯入並修正圖示名稱）。在進行下一步前將問題全數修正。
8. **需要明確指定 Registry (Registry must be explicit)** — 當使用者要求加入某區塊或元件時，**不要用猜測的 registry**。如果沒有指定（例如使用者說「加入一個登入區塊」，但沒指定 `@shadcn`, `@tailark` 等），請詢問該使用哪個 registry。絕不要替使用者預設。
9. **切換 presets (Switching presets)** — 請先詢問使用者要：**重新安裝 (reinstall)**、**合併 (merge)**，還是**略過 (skip)**？
   - **Reinstall (重新安裝)**：`npx shadcn@latest init --preset <code> --force --reinstall`。會覆蓋所有元件。
   - **Merge (合併)**：`npx shadcn@latest init --preset <code> --force --no-reinstall`，接著執行 `npx shadcn@latest info` 以列出已安裝元件，然後對每一個已安裝的元件使用 `--dry-run` 與 `--diff` 各別進行 [智能合併 (smart merge)](#updating-components)。
   - **Skip (略過)**：`npx shadcn@latest init --preset <code> --force --no-reinstall`。只更新 config 與 CSS，元件保留不動。
   - **Important (重要建議)**：請永遠在使用者專案目錄內執行 preset 指令。CLI 會自動保留 `components.json` 裡的 base 設定（`base` 與 `radix`）。如果必須使用暫存/草稿目錄（例如為了進行 `--dry-run` 比對），請明確加上 `--base <current-base>` — preset 代碼裡面不會包含 base 的資訊。

## Updating Components (更新元件)

當使用者要求從上游 (upstream) 更新元件但保留本地變更時，請使用 `--dry-run` 與 `--diff` 來智慧化合併。**絕對不要手動從 GitHub 抓取原始檔案 — 請永遠使用 CLI。**

1. 執行 `npx shadcn@latest add <component> --dry-run` 檢視哪些檔案會受到影響。
2. 對於每一個檔案，執行 `npx shadcn@latest add <component> --diff <file>` 以查看上游與本地的差異 (diff)。
3. 根據 diff 對每個檔案做決定：
   - 沒有本地變更 → 安全覆蓋無虞。
   - 含有本地變更 → 閱讀本地檔案，分析差異點，套用上游更新的同時保留本地端的修改。
   - 使用者說「全部直接更新」 → 使用 `--overwrite`，但請先確認過。
4. **絕對不要在沒有使用者明確同意的情況下使用 `--overwrite`。**

## Quick Reference (快速參考指南)

```bash
# 建立一個新專案。
npx shadcn@latest init --name my-app --preset base-nova
npx shadcn@latest init --name my-app --preset a2r6bw --template vite

# 建立一個 Monorepo 專案。
npx shadcn@latest init --name my-app --preset base-nova --monorepo
npx shadcn@latest init --name my-app --preset base-nova --template next --monorepo

# 初始化現有專案。
npx shadcn@latest init --preset base-nova
npx shadcn@latest init --defaults  # 捷徑：--template=next --preset=base-nova

# 加入元件。
npx shadcn@latest add button card dialog
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add --all

# 在新增/更新之前預覽變更。
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff button.tsx
npx shadcn@latest add @acme/form --view button.tsx

# 在 registries 裡尋找。
npx shadcn@latest search @shadcn -q "sidebar"
npx shadcn@latest search @tailark -q "stats"

# 獲取元件的文件和範例網址。
npx shadcn@latest docs button dialog select

# 檢視 registry 項目細節（用於尚未安裝的項目）。
npx shadcn@latest view @shadcn/button
```

**具名 presets：** `base-nova`, `radix-nova`
**範本Templates：** `next`, `vite`, `start`, `react-router`, `astro`（皆支援 `--monorepo`）以及 `laravel`（不支援 monorepo）
**Preset 代碼：** 開頭為 `a` 的 Base62 字串（例如 `a2r6bw`），可從 [ui.shadcn.com](https://ui.shadcn.com) 取得。

## Detailed References (詳細參考資料)

- [rules/forms.md](./rules/forms.md) — FieldGroup, Field, InputGroup, ToggleGroup, FieldSet, 驗證狀態
- [rules/composition.md](./rules/composition.md) — 群組, 覆蓋層, Card, Tabs, Avatar, Alert, Empty, Toast, Separator, Skeleton, Badge, 按鈕載入狀態
- [rules/icons.md](./rules/icons.md) — data-icon, 圖示尺寸, 以物件形式傳遞圖示
- [rules/styling.md](./rules/styling.md) — 語意化顏色 (Semantic colors), variants, className, 間距, 尺寸, truncate, 黑暗模式 (dark mode), cn(), z-index
- [rules/base-vs-radix.md](./rules/base-vs-radix.md) — asChild 對比 render, Select, ToggleGroup, Slider, Accordion
- [cli.md](./cli.md) — 指令, flags (旗標), presets, 範本
- [customization.md](./customization.md) — 主題化 (Theming), CSS 變數, 擴充元件
