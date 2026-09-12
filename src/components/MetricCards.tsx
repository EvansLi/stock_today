import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PortfolioSummary } from '../types/portfolio';
import { formatCurrency, formatNumber } from '../lib/calculations';

interface MetricCardsProps {
  summary: PortfolioSummary;
  targetCurrency: 'TWD' | 'USD';
  colorConvention: 'US' | 'TW';
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  summary,
  targetCurrency,
  colorConvention,
}) => {
  const {
    totalValueTarget,
    totalCostTarget,
    totalProfitTarget,
    totalProfitRateTarget,
    todayProfitTarget,
    todayProfitRateTarget,
  } = summary;

  // 取得漲跌顏色 class
  const getTrendColor = (value: number) => {
    if (value > 0) {
      return colorConvention === 'US' ? 'text-emerald-400' : 'text-red-400';
    } else if (value < 0) {
      return colorConvention === 'US' ? 'text-red-400' : 'text-emerald-400';
    }
    return 'text-zinc-400';
  };

  const getTrendBg = (value: number) => {
    if (value > 0) {
      return colorConvention === 'US' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20';
    } else if (value < 0) {
      return colorConvention === 'US' ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20';
    }
    return 'bg-zinc-500/10 border-zinc-500/20';
  };

  const formatPercent = (val: number) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${formatNumber(val, 2)}%`;
  };

  const formatProfit = (val: number) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${formatCurrency(val, targetCurrency)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6 mb-8"
    >
      {/* 總資產估值 */}
      <motion.div
        variants={cardVariants}
        className="relative overflow-hidden rounded-xl border border-[#1f1f23] bg-[#09090b] p-6 shadow-xl"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-zinc-400">總資產估值</span>
          <div className="rounded-lg bg-blue-500/10 p-2 border border-blue-500/20">
            <Wallet className="h-5 w-5 text-blue-400" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold tracking-tight text-[#fafafa]">
            {formatCurrency(totalValueTarget, targetCurrency)}
          </span>
          <span className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            原始總成本: <span className="font-semibold text-zinc-400">{formatCurrency(totalCostTarget, targetCurrency)}</span>
          </span>
        </div>
      </motion.div>

      {/* 今日總損益 */}
      <motion.div
        variants={cardVariants}
        className="relative overflow-hidden rounded-xl border border-[#1f1f23] bg-[#09090b] p-6 shadow-xl"
      >
        <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-xl pointer-events-none ${
          todayProfitTarget > 0 
            ? (colorConvention === 'US' ? 'bg-emerald-500/10' : 'bg-red-500/10')
            : (colorConvention === 'US' ? 'bg-red-500/10' : 'bg-emerald-500/10')
        }`} />
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-zinc-400">今日總損益</span>
          <div className={`rounded-lg p-2 border ${getTrendBg(todayProfitTarget)}`}>
            {todayProfitTarget >= 0 ? (
              <ArrowUpRight className={`h-5 w-5 ${getTrendColor(todayProfitTarget)}`} />
            ) : (
              <ArrowDownRight className={`h-5 w-5 ${getTrendColor(todayProfitTarget)}`} />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <span className={`text-3xl font-bold tracking-tight ${getTrendColor(todayProfitTarget)}`}>
            {formatProfit(todayProfitTarget)}
          </span>
          <span className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            今日漲跌幅: 
            <span className={`font-semibold ${getTrendColor(todayProfitRateTarget)}`}>
              {formatPercent(todayProfitRateTarget)}
            </span>
          </span>
        </div>
      </motion.div>

      {/* 累積總損益 */}
      <motion.div
        variants={cardVariants}
        className="relative overflow-hidden rounded-xl border border-[#1f1f23] bg-[#09090b] p-6 shadow-xl"
      >
        <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-xl pointer-events-none ${
          totalProfitTarget > 0 
            ? (colorConvention === 'US' ? 'bg-emerald-500/10' : 'bg-red-500/10')
            : (colorConvention === 'US' ? 'bg-red-500/10' : 'bg-emerald-500/10')
        }`} />
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-zinc-400">累積總損益</span>
          <div className={`rounded-lg p-2 border ${getTrendBg(totalProfitTarget)}`}>
            <TrendingUp className={`h-5 w-5 ${getTrendColor(totalProfitTarget)}`} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className={`text-3xl font-bold tracking-tight ${getTrendColor(totalProfitTarget)}`}>
            {formatProfit(totalProfitTarget)}
          </span>
          <span className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
            投資報酬率 (ROI): 
            <span className={`font-semibold ${getTrendColor(totalProfitRateTarget)}`}>
              {formatPercent(totalProfitRateTarget)}
            </span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
