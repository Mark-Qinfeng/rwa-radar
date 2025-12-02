"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Activity, Shield, TrendingUp, 
  Clock, Newspaper, RefreshCw 
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// 1. 增加 defillamaId 字段，用于获取真实 TVL
const INITIAL_ASSETS = [
  { id: 'ondo-finance', defillamaId: 'ondo-finance', symbol: 'ONDO', name: 'Ondo Finance', price: 0, change: 0, tvl: '-', history: [0,0,0,0,0] },
  { id: 'maker', defillamaId: 'makerdao', symbol: 'MKR', name: 'MakerDAO', price: 0, change: 0, tvl: '-', history: [0,0,0,0,0] },
  { id: 'centrifuge', defillamaId: 'centrifuge', symbol: 'CFG', name: 'Centrifuge', price: 0, change: 0, tvl: '-', history: [0,0,0,0,0] },
  { id: 'maple', defillamaId: 'maple', symbol: 'MPL', name: 'Maple Finance', price: 0, change: 0, tvl: '-', history: [0,0,0,0,0] },
  { id: 'goldfinch', defillamaId: 'goldfinch', symbol: 'GFI', name: 'Goldfinch', price: 0, change: 0, tvl: '-', history: [0,0,0,0,0] },
];

// 辅助函数：把数字变成 B (Billion) 或 M (Million)
const formatTVL = (num: number) => {
  if (!num) return '-';
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
};

export default function Home() {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [news, setNews] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // --- 获取价格 (CoinGecko) ---
  const fetchPrices = async () => {
    try {
      const ids = assets.map(a => a.id).join(',');
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
      if (!res.ok) throw new Error('Price API Error');
      const data = await res.json();

      setAssets(prev => prev.map(asset => {
        const newPrice = data[asset.id]?.usd || asset.price;
        const newChange = data[asset.id]?.usd_24h_change || 0;
        // 如果价格是0，先填满历史，否则追加
        const currentHistory = asset.history[0] === 0 ? Array(5).fill(newPrice) : asset.history;
        const newHistory = [...currentHistory.slice(1), newPrice]; 
        return { ...asset, price: newPrice, change: newChange, history: newHistory };
      }));
      setLastUpdate(new Date());
    } catch (e) { console.warn("Price fetch failed, using old data"); }
  };

  // --- 获取 TVL (DefiLlama) ---
  const fetchTVL = async () => {
    try {
      // 并行获取所有协议的 TVL
      const promises = assets.map(async (asset) => {
        if (!asset.defillamaId) return { id: asset.id, tvl: 0 };
        const res = await fetch(`https://api.llama.fi/tvl/${asset.defillamaId}`);
        const tvlNum = await res.json();
        return { id: asset.id, tvl: tvlNum };
      });

      const results = await Promise.all(promises);
      
      // 更新 State
      setAssets(prev => prev.map(asset => {
        const found = results.find(r => r.id === asset.id);
        return found ? { ...asset, tvl: formatTVL(found.tvl) } : asset;
      }));
    } catch (e) { console.error("TVL fetch failed", e); }
  };

  // --- 获取新闻 ---
  const fetchNews = async () => {
    try {
      const res = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
      const data = await res.json();
      if (data.Data) setNews(data.Data.slice(0, 6));
    } catch (e) { console.error("News fetch error"); }
  };

  useEffect(() => {
    fetchPrices();
    fetchTVL(); // 新增：加载 TVL
    fetchNews();
    const timer = setInterval(fetchPrices, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <nav className="border-b border-white/10 backdrop-blur-md fixed w-full z-50 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">RWA Radar</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
               {lastUpdate ? <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> : <RefreshCw className="w-3 h-3 animate-spin" />}
               <span>Updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Loading...'}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-gray-400 text-sm mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> RWA Market Cap</div>
            <div className="text-3xl font-bold">$9.42 Billion</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-gray-400 text-sm mb-2 flex items-center gap-2"><Shield className="w-4 h-4"/> Tokenized Treasuries</div>
            <div className="text-3xl font-bold">$1.2 Billion</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-gray-400 text-sm mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Avg. Yield (APY)</div>
            <div className="text-3xl font-bold">5.4%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assets Table */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" /> Top Protocols
            </h2>
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="grid grid-cols-12 p-4 text-xs text-gray-500 uppercase tracking-wider border-b border-white/10">
                <div className="col-span-4">Asset</div>
                <div className="col-span-3 text-right">Price</div>
                <div className="col-span-3 text-right">TVL</div>
                <div className="col-span-2 text-right">Trend</div>
              </div>
              
              {assets.map((asset) => (
                <Link href={`/asset/${asset.id}`} key={asset.id} className="block group">
                  <div className="grid grid-cols-12 p-4 items-center hover:bg-white/5 transition-all border-b border-white/5 cursor-pointer">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold border border-white/10">
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{asset.name}</div>
                        <div className="text-xs text-gray-500">{asset.symbol}</div>
                      </div>
                    </div>
                    <div className="col-span-3 text-right font-mono">
                      ${asset.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      <div className={`text-xs ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                      </div>
                    </div>
                    <div className="col-span-3 text-right text-gray-400 font-mono">{asset.tvl}</div>
                    <div className="col-span-2 h-8 w-24 ml-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={asset.history.map((v, i) => ({v, i}))}>
                          <Line type="monotone" dataKey="v" stroke={asset.change >= 0 ? "#4ade80" : "#f87171"} strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* News Feed */}
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-purple-500" /> Latest News
            </h2>
            <div className="space-y-4">
              {news.length > 0 ? news.map((item: any) => (
                <a key={item.id} href={item.url} target="_blank" className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded uppercase">
                      {item.source_info?.name || 'News'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(item.published_on * 1000).getHours()}:00
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-300 group-hover:text-white line-clamp-2">
                    {item.title}
                  </h3>
                </a>
              )) : <div className="text-gray-500 text-sm">Loading news...</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
