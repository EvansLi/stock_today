import React from 'react';
import { TrendingUp, RefreshCw, Palette } from 'lucide-react';

interface NavbarProps {
  updatedAt: string;
  targetCurrency: 'TWD' | 'USD';
  setTargetCurrency: (currency: 'TWD' | 'USD') => void;
  colorConvention: 'US' | 'TW';
  setColorConvention: (convention: 'US' | 'TW') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  updatedAt,
  targetCurrency,
  setTargetCurrency,
  colorConvention,
  setColorConvention,
}) => {
  // 格式化最後更新時間
  const formattedDate = React.useMemo(() => {
    if (!updatedAt) return '未載入';
    try {
      const date = new Date(updatedAt);
      return new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short',
      }).format(date);
    } catch {
      return updatedAt;
    }
  }, [updatedAt]);

  return (
    <nav className="border-b border-[#1f1f23] bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
              Personal Portfolio Dashboard
            </h1>
            <p className="text-xs text-[#a1a1aa] flex items-center gap-1 mt-0.5">
              <RefreshCw className="h-3 w-3 animate-spin-slow text-zinc-500" />
              資料更新時間: <span className="text-[#fafafa] font-medium">{formattedDate}</span>
            </p>
          </div>
        </div>

        {/* 控制項 */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* 計價幣別切換 */}
          <div className="flex items-center bg-[#18181b] p-1 rounded-lg border border-[#27272a]">
            <button
              onClick={() => setTargetCurrency('TWD')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                targetCurrency === 'TWD'
                  ? 'bg-[#27272a] text-[#fafafa] shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              台幣 (TWD)
            </button>
            <button
              onClick={() => setTargetCurrency('USD')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                targetCurrency === 'USD'
                  ? 'bg-[#27272a] text-[#fafafa] shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              美金 (USD)
            </button>
          </div>

          {/* 色彩慣例切換 (美股 / 台股) */}
          <div className="flex items-center bg-[#18181b] p-1 rounded-lg border border-[#27272a]">
            <button
              onClick={() => setColorConvention('US')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                colorConvention === 'US'
                  ? 'bg-[#27272a] text-emerald-400 shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
              title="漲綠跌紅 (美股慣例)"
            >
              <Palette className="h-3.5 w-3.5" />
              美股慣例
            </button>
            <button
              onClick={() => setColorConvention('TW')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                colorConvention === 'TW'
                  ? 'bg-[#27272a] text-red-500 shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
              title="漲紅跌綠 (台股慣例)"
            >
              <Palette className="h-3.5 w-3.5" />
              台股慣例
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
