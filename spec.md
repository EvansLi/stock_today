# 📈 Personal Portfolio Dashboard

以零主機成本為目標設計的個人投資追蹤儀表板。透過 GitHub Actions 定期排程抓取台股與美股收盤行情，並以純前端靜態架構呈現持股狀態、今日損益與總體累積報酬。

---

## 🛠 技術棧選型 (Tech Stack)

* **前端框架 (Frontend)**: React 18+ (Vite) + TypeScript
* **樣式與組件 (Styling & UI)**: Tailwind CSS + shadcn/ui (Radix UI)
* **圖示與動畫 (Icons & Motion)**: Lucide React + Framer Motion
* **圖表庫 (Charts)**: Recharts
* **資料抓取腳本 (Backend Script)**: Python 3.10+ (`yfinance`, `pandas`)
* **排程自動化 (Automation)**: GitHub Actions (Scheduled Workflow)
* **託管部署 (Hosting)**: GitHub Pages / Cloudflare Pages / Vercel

---

## 📁 系統資料結構規範 (Data Schema)

資料儲存於 `public/data/` 目錄：

### 1. `portfolio.json` (持股交易清單)
```json
[
  {
    "id": "1",
    "symbol": "AAPL",
    "market": "US",
    "shares": 15,
    "buyDate": "2024-01-15",
    "costPrice": 182.5
  },
  {
    "id": "2",
    "symbol": "2330.TW",
    "market": "TW",
    "shares": 1000,
    "buyDate": "2024-03-01",
    "costPrice": 750.0
  }
]
```

* **標的代號規範**：
  * 美股：標準代號，如 `AAPL`, `VOO`, `NVDA`
  * 台股上市：代號 + `.TW`，如 `2330.TW`, `0050.TW`
  * 台股上櫃：代號 + `.TWO`，如 `6488.TWO`

### 2. `prices.json` (排程自動產出行情)
```json
{
  "updatedAt": "2026-09-10T22:00:00Z",
  "exchangeRate": {
    "USDTWD": 32.2
  },
  "data": {
    "AAPL": {
      "currentPrice": 225.5,
      "previousClose": 222.0,
      "currency": "USD"
    },
    "2330.TW": {
      "currentPrice": 960.0,
      "previousClose": 945.0,
      "currency": "TWD"
    }
  }
}
```

---

## ⚙️ 模組規格與實作要求

### 模組一：價格爬蟲腳本 (`scripts/fetch_prices.py`)
1. 讀取 `public/data/portfolio.json`，提取不重複的 `symbol` 清單。
2. 使用 `yfinance` 批次查詢每個代號的當前市價（Current Price）與前日收盤價（Previous Close）。
3. 查詢 `USDTWD=X` 取得最新美金兌台幣匯率。
4. 具備單標的失敗容錯處理，確保其餘標的能正常輸出。
5. 產出並覆蓋寫入 `public/data/prices.json`。

### 模組二：排程工作流 (`.github/workflows/update_prices.yml`)
1. **觸發條件**：
   * 排程：每週一至週五 美股收盤後（UTC 21:30 / 台北時間上午 05:30）。
   * 手動觸發：支援 `workflow_dispatch`。
2. **工作流權限**：需宣告 `permissions: contents: write`。
3. **執行步驟**：
   * 檢出專案代碼。
   * 安裝 Python 與相依套件 (`yfinance`, `pandas`)。
   * 執行 `python scripts/fetch_prices.py`。
   * 檢測檔案異動，若有變更則 Commit 並 Push 回儲存庫。

### 模組三：前端資產儀表板 (Dashboard)

#### 1. 數值計算公式
* **單筆現值**：`shares * currentPrice`
* **單筆成本**：`shares * costPrice`
* **總報酬金額**：`現值 - 總成本`
* **總報酬率**：`(現值 - 總成本) / 總成本 * 100%`
* **今日損益**：`shares * (currentPrice - previousClose)`
* **今日漲跌幅**：`(currentPrice - previousClose) / previousClose * 100%`

#### 2. UI/UX 與視覺規範
* **風格**：現代 Fintech / SaaS 儀表板，支援預設 Dark Mode（基於 Slate / Zinc 配色）。
* **頂部總覽卡片 (Metric Cards)**：
  * 總資產估值
  * 今日總損益（金額與百分比）
  * 累積總損益（金額與報酬率）
  * 資料最後更新時間、計價幣別切換開關 (TWD / USD)。
* **圖表區 (Charts)**：
  * 美股 vs 台股資產佔比圓餅圖。
  * 前五大持股分佈長條圖。
* **持股清單表格 (Holdings Table)**：
  * 顯示欄位：標的代號、市場別 Badge、股數、買入成本、現價、今日損益、累積損益與報酬率。
  * 支援美股慣例（綠漲紅跌）或台股慣例（紅漲綠跌）的色彩切換。
* **資料快取處理**：前端 fetch JSON 時需加上時間戳 query 參數以避免 CDN / 瀏覽器快取。

---

## 📂 專案目錄結構

```text
├── .github/
│   └── workflows/
│       └── update_prices.yml
├── public/
│   └── data/
│       ├── portfolio.json
│       └── prices.json
├── scripts/
│   ├── requirements.txt
│   └── fetch_prices.py
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── AssetCharts.tsx
│   │   ├── HoldingsTable.tsx
│   │   ├── MetricCards.tsx
│   │   └── Navbar.tsx
│   ├── lib/
│   │   ├── calculations.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── portfolio.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tailwind.config.js
└── README.md
```

