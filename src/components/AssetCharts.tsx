import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { HoldingDetail } from '../types/portfolio';
import { formatCurrency, formatNumber } from '../lib/calculations';

interface AssetChartsProps {
  holdings: HoldingDetail[];
  targetCurrency: 'TWD' | 'USD';
}

const COLORS = [
  '#3b82f6', // 藍
  '#10b981', // 綠 (或翠綠)
  '#8b5cf6', // 紫
  '#f59e0b', // 橘黃
  '#ec4899', // 粉
  '#06b6d4', // 青
];

export const AssetCharts: React.FC<AssetChartsProps> = ({ holdings, targetCurrency }) => {
  // 1. 整理美股 vs 台股佔比
  const marketData = React.useMemo(() => {
    let usTotal = 0;
    let twTotal = 0;

    holdings.forEach((h) => {
      if (h.market === 'US') {
        usTotal += h.currentValueTarget;
      } else {
        twTotal += h.currentValueTarget;
      }
    });

    const total = usTotal + twTotal;
    if (total === 0) return [];

    return [
      { name: '美股資產 (US)', value: usTotal, percentage: (usTotal / total) * 100 },
      { name: '台股資產 (TW)', value: twTotal, percentage: (twTotal / total) * 100 },
    ].filter((d) => d.value > 0);
  }, [holdings]);

  // 2. 前五大持股
  const topHoldingsData = React.useMemo(() => {
    return [...holdings]
      .sort((a, b) => b.currentValueTarget - a.currentValueTarget)
      .slice(0, 5)
      .map((h) => ({
        symbol: h.symbol,
        value: h.currentValueTarget,
      }));
  }, [holdings]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#18181b] border border-[#27272a] p-3 rounded-lg shadow-xl text-xs">
          <p className="font-semibold text-[#fafafa] mb-1">{payload[0].name || data.symbol}</p>
          <p className="text-zinc-400">
            現值: <span className="text-[#fafafa] font-medium">{formatCurrency(payload[0].value, targetCurrency)}</span>
          </p>
          {data.percentage !== undefined && (
            <p className="text-zinc-400 mt-0.5">
              佔比: <span className="text-[#fafafa] font-medium">{formatNumber(data.percentage, 2)}%</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto px-6 mb-8"
    >
      {/* 圓餅圖：市場比例 */}
      <div className="border border-[#1f1f23] bg-[#09090b] rounded-xl p-6 shadow-xl flex flex-col h-[380px]">
        <h3 className="text-base font-semibold text-[#fafafa] mb-4">資產配置佔比 (美股 vs 台股)</h3>
        <div className="flex-1 min-h-0 relative">
          {marketData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
              無資產資料
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketData}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {marketData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#09090b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value, entry: any) => {
                    const percentage = entry.payload?.percentage ?? 0;
                    return (
                      <span className="text-xs text-zinc-400 hover:text-[#fafafa] transition-colors">
                        {value} ({formatNumber(percentage, 1)}%)
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 長條圖：前五大持股 */}
      <div className="border border-[#1f1f23] bg-[#09090b] rounded-xl p-6 shadow-xl flex flex-col h-[380px]">
        <h3 className="text-base font-semibold text-[#fafafa] mb-4">前五大持股分佈</h3>
        <div className="flex-1 min-h-0 relative">
          {topHoldingsData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
              無持股資料
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topHoldingsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <XAxis
                  dataKey="symbol"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => {
                    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                    return val;
                  }}
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {topHoldingsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
};
