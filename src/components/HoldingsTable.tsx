import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { HoldingDetail } from '../types/portfolio';
import { formatCurrency, formatNumber } from '../lib/calculations';

interface HoldingsTableProps {
  holdings: HoldingDetail[];
  targetCurrency: 'TWD' | 'USD';
  colorConvention: 'US' | 'TW';
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  targetCurrency,
  colorConvention,
}) => {
  // 取得損益與漲跌字型與背景色
  const getTrendStyle = (value: number) => {
    if (value > 0) {
      return colorConvention === 'US'
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        : 'text-red-400 bg-red-500/10 border-red-500/20';
    } else if (value < 0) {
      return colorConvention === 'US'
        ? 'text-red-400 bg-red-500/10 border-red-500/20'
        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
    return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
  };

  const getTrendTextColor = (value: number) => {
    if (value > 0) {
      return colorConvention === 'US' ? 'text-emerald-400' : 'text-red-400';
    } else if (value < 0) {
      return colorConvention === 'US' ? 'text-red-400' : 'text-emerald-400';
    }
    return 'text-zinc-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-7xl mx-auto px-6 mb-12"
    >
      <div className="border border-[#1f1f23] bg-[#09090b] rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-[#1f1f23] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-semibold text-[#fafafa]">投資持股明細</h3>
            <p className="text-xs text-zinc-500 mt-1">目前所有在倉部位之即時行情與績效損益</p>
          </div>
          <span className="text-xs bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full font-medium text-zinc-400">
            部位總數: {holdings.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1f1f23] bg-[#18181b]/30 text-xs text-zinc-400 font-medium">
                <th className="px-6 py-4">標的代號 / 市場</th>
                <th className="px-6 py-4 text-right">股數</th>
                <th className="px-6 py-4 text-right">平均成本 (原幣)</th>
                <th className="px-6 py-4 text-right">當前現價 (原幣)</th>
                <th className="px-6 py-4 text-right">今日漲跌幅</th>
                <th className="px-6 py-4 text-right">累積損益 / 報酬</th>
                <th className="px-6 py-4 text-right">持股現值 ({targetCurrency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f23] text-sm">
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-zinc-500">
                    目前沒有持股明細
                  </td>
                </tr>
              ) : (
                holdings.map((h) => {
                  const todayChangePercent = h.todayProfitRateLocal;
                  const totalProfitPercent = h.totalProfitRateLocal;

                  return (
                    <tr key={h.id} className="hover:bg-[#18181b]/30 transition-colors">
                      {/* 標的與市場 */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <span className="font-bold text-[#fafafa] tracking-wide block">
                              {h.symbol}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                                  h.market === 'US'
                                    ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                                    : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                                }`}
                              >
                                {h.market}
                              </span>
                              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-zinc-600" />
                                {h.buyDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 股數 */}
                      <td className="px-6 py-4 text-right font-medium text-zinc-300">
                        {formatNumber(h.shares, 0)}
                      </td>

                      {/* 買入成本 (原幣) */}
                      <td className="px-6 py-4 text-right font-medium text-zinc-300">
                        {h.currency === 'USD' ? `$ ${formatNumber(h.costPrice, 2)}` : `NT$ ${formatNumber(h.costPrice, 0)}`}
                      </td>

                      {/* 當前現價 (原幣) */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-[#fafafa]">
                          {h.currency === 'USD' ? `$ ${formatNumber(h.currentPrice, 2)}` : `NT$ ${formatNumber(h.currentPrice, 0)}`}
                        </span>
                        <span className={`block text-[10px] ${getTrendTextColor(h.todayProfitLocal)} mt-0.5`}>
                          今日: {h.todayProfitLocal >= 0 ? '+' : ''}
                          {h.currency === 'USD' ? formatNumber(h.todayProfitLocal, 2) : formatNumber(h.todayProfitLocal, 0)}
                        </span>
                      </td>

                      {/* 今日漲跌幅 */}
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getTrendStyle(
                            todayChangePercent
                          )}`}
                        >
                          {todayChangePercent >= 0 ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          )}
                          {todayChangePercent >= 0 ? '+' : ''}
                          {formatNumber(todayChangePercent, 2)}%
                        </span>
                      </td>

                      {/* 累積損益 / 報酬率 */}
                      <td className="px-6 py-4 text-right">
                        <span className={`font-semibold block ${getTrendTextColor(h.totalProfitTarget)}`}>
                          {h.totalProfitTarget >= 0 ? '+' : ''}
                          {formatCurrency(h.totalProfitTarget, targetCurrency)}
                        </span>
                        <span className={`text-xs block mt-0.5 ${getTrendTextColor(h.totalProfitTarget)}`}>
                          {totalProfitPercent >= 0 ? '+' : ''}
                          {formatNumber(totalProfitPercent, 2)}%
                        </span>
                      </td>

                      {/* 累積現值 */}
                      <td className="px-6 py-4 text-right font-semibold text-[#fafafa]">
                        {formatCurrency(h.currentValueTarget, targetCurrency)}
                        <span className="block text-[10px] text-zinc-500 mt-0.5">
                          佔比: {formatNumber((h.currentValueTarget / Math.max(1, holdings.reduce((sum, item) => sum + item.currentValueTarget, 0))) * 100, 1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
