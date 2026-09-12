### UI/UX 設計規範指令
1. **設計風格**：採用現代 Fintech / SaaS 儀表板風格（參考 Linear、Vercel 或 Stripe Dashboard）。
2. **顏色系統**：
   - 支援深色模式（Dark mode first，以 Slate/Zinc 為暗色底色，避免純黑 `#000000`）。
   - 股票漲跌色彩符合市場慣例（台股/美股顯示可自訂，美股綠漲紅跌、台股紅漲綠跌，請預留切換或清楚標示）。
3. **組件規範**：
   - 使用 Tailwind CSS 與 shadcn/ui 風格的組件。
   - 善用 Card 分割區塊，加入細微邊框 (`border border-border/50`) 與適度圓角 (`rounded-xl`)。
   - 資訊架構要有清晰層次：大數字（Metric）、副標說明（Muted text）、標籤（Badge）。
4. **互動體驗**：
   - 加入載入骨架屏（Skeleton Loader）。
   - 數字變化或頁面載入時使用微平滑過渡（Framer Motion）。