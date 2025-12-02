"use client"; // 1. 标记为客户端组件，允许使用 Hook 和实时更新

import React, { useState, useEffect } from 'react';
import { 
  Globe, Activity, Shield, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Clock, 
  DollarSign, Newspaper, RefreshCw 
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

// 模拟的初始数据，防止页面一开始显示 0
const INITIAL_ASSETS = [
  { id: 'ondo-finance', symbol: 'ONDO', name: 'Ondo Finance', price: 0.75, change: 2.5, history: [0.70, 0.72, 0.71, 0.74, 0.75, 0.76, 0.75] },
  { id: 'maker', symbol: 'MKR', name: 'MakerDAO', price: 2100, change: -1.2, history: [2150, 2120, 2100, 2080, 2090, 2100, 2100] },
  { id: 'centrifuge', symbol: 'CFG', name: 'Centrifuge', price: 0.65, change: 5.4, history: [0.60, 0.61, 0.63, 0.62, 0.64, 0.65, 0.65] },
  { id: 'maple', symbol: 'MPL', name: 'Maple Finance', price: 14.2, change: 0.8, history: [13.8, 14.0, 14.1, 13.9, 14.2, 14.1, 14.2] },
];

export default function Home() {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // 获取实时价格的函数
  const fetchPrices = async () => {
    try {
      // 这是一个 API 技巧：一次请求获取所有币种，节省额度
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ondo-finance,maker,centrifuge,maple&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await response.json();

      // 更新资产状态
      setAssets(prevAssets => prevAssets.map(asset => {
        const newPrice = data[asset.id]?.usd || asset.price;
        const newChange = data[asset.id]?.usd_24h_change || asset.change;
        
        // 模拟走势图数据更新 (把最新价格加到历史数组末尾，移除第一个)
        const newHistory = [...asset.history.slice(1), newPrice];

        return {
          ...asset,
          price: newPrice,
          change: newChange,
          history: newHistory
        };
      }));
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      // 即使失败也不要崩溃，保持旧数据
      setLoading(false);
    }
  };

  // 页面加载时执行，并设置定时器
  useEffect(() => {
    fetchPrices(); // 立即执行一次
    const interval = setInterval(fetchPrices, 10000); // 每 10 秒刷新一次
    return () => clearInterval(interval); // 清理定时器
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-md fixed w-full z-50 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">RWA Radar</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
               {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
               <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Live Market Data
          </h1>
          <p className="text-gray-400 text-lg">
            Real-time pricing and volatility tracking for top RWA protocols.
          </p>
        </div>

        {/* Asset Table with Charts */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-12 p-4 text-sm text-gray-400 border-b border-white/10 font-medium">
            <div className="col-span-3">Asset</div>
            <div className="col-span-3 text-right">Price</div>
            <div className="col-span-3 text-right">24h Change</div>
            <div className="col-span-3 text-right">Trend (Last 7 Updates)</div>
          </div>
          
          {assets.map((asset) => (
            <div key={asset.id} className="grid grid-cols-12 p-4 items-center hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
              
              {/* Name & Symbol */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center font-bold text-sm text-gray-300">
                  {asset.symbol[0]}
                </div>
                <div>
                  <div className="font-bold text-white">{asset.name}</div>
                  <div className="text-xs text-blue-400">{asset.symbol}</div>
                </div>
              </div>

              {/* Price (Animated) */}
              <div className="col-span-3 text-right font-mono text-lg text-white">
                ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              {/* Change */}
              <div className="col-span-3 flex justify-end">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${asset.change >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {asset.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(asset.change).toFixed(2)}%
                </div>
              </div>

              {/* Mini Chart (Sparkline) */}
              <div className="col-span-3 h-12 w-full flex justify-end">
                <div className="w-32 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={asset.history.map((val, i) => ({ i, val }))}>
                      <Line 
                        type="monotone" 
                        dataKey="val" 
                        stroke={asset.change >= 0 ? "#4ade80" : "#f87171"} 
                        strokeWidth={2} 
                        dot={false} 
                      />
                      <YAxis domain={['auto', 'auto']} hide />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
