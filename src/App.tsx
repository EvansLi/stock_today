import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { AssetCharts } from './components/AssetCharts';
import { HoldingsTable } from './components/HoldingsTable';
import { PortfolioItem, PricesData, PortfolioSummary } from './types/portfolio';
import { calculatePortfolio } from './lib/calculations';
import { ShieldAlert, Cpu, Github, RefreshCw } from 'lucide-react';

function App() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [prices, setPrices] = useState<PricesData | null>(null);
  const [targetCurrency, setTargetCurrency] = useState<'TWD' | 'USD'>('TWD');
  const [colorConvention, setColorConvention] = useState<'US' | 'TW'>('US');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 加上時間戳，防止快取
        const timestamp = Date.now();
        
        const [portfolioRes, pricesRes] = await Promise.all([
          fetch(`/data/portfolio.json?t=${timestamp}`),
          fetch(`/data/prices.json?t=${timestamp}`),
        ]);

        if (!portfolioRes.ok) {
          throw new Error('無法取得投資持股資料 (portfolio.json)');
        }
        if (!pricesRes.ok) {
          throw new Error('無法取得即時行情資料 (prices.json)');
        }

        const portfolioData: PortfolioItem[] = await portfolioRes.json();
        const pricesData: PricesData = await pricesRes.json();

        setPortfolio(portfolioData);
        setPrices(pricesData);
      } catch (err: any) {
        console.error('Data loading error:', err);
        setError(err.message || '載入資料時發生未知錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 計算所得的投資組合統計與明細
  const summary: PortfolioSummary = React.useMemo(() => {
    return calculatePortfolio(portfolio, prices, targetCurrency);
  }, [portfolio, prices, targetCurrency]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-[#fafafa] p-6">
        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
        <p className="text-sm text-zinc-400 font-medium">正在載入資產儀表板數據...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-[#fafafa] p-6">
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl max-w-md w-full text-center">
          <ShieldAlert className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#fafafa] mb-1">發生錯誤</h2>
          <p className="text-sm text-zinc-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-[#fafafa] text-xs font-semibold py-2.5 px-4 rounded-lg border border-zinc-700 transition-colors"
          >
            重新整理嘗試
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b]">
      {/* 頂部導覽列 */}
      <Navbar
        updatedAt={summary.updatedAt}
        targetCurrency={targetCurrency}
        setTargetCurrency={setTargetCurrency}
        colorConvention={colorConvention}
        setColorConvention={setColorConvention}
      />

      {/* 儀表板主要內容 */}
      <main className="flex-1 py-8">
        {/* 指標卡片 */}
        <MetricCards
          summary={summary}
          targetCurrency={targetCurrency}
          colorConvention={colorConvention}
        />

        {/* 資產圖表 */}
        <AssetCharts
          holdings={summary.holdings}
          targetCurrency={targetCurrency}
        />

        {/* 持股清單表格 */}
        <HoldingsTable
          holdings={summary.holdings}
          targetCurrency={targetCurrency}
          colorConvention={colorConvention}
        />
      </main>

      {/* 底部 Footer */}
      <footer className="border-t border-[#1f1f23] bg-[#09090b] py-8 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-zinc-700" />
            <span>架構：純前端靜態 (Vite) + Python 排程 + GitHub Actions 零主機成本設計</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-400 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub 儲存庫</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
