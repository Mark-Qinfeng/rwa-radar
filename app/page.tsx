"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Activity, Shield, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Clock, 
  Newspaper, RefreshCw, ChevronRight 
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function Home() {
  const [assets, setAssets] = useState([
    { id: 'ondo-finance', symbol: 'ONDO', name: 'Ondo Finance', price: 0, change: 0, tvl: '450M', history: [0.7, 0.72, 0.71, 0.74, 0.75] },
    { id: 'maker', symbol: 'MKR', name: 'MakerDAO', price: 0, change: 0, tvl: '8.2B', history: [2100, 2120, 2110, 2140, 2130] },
    { id: 'centrifuge', symbol: 'CFG', name: 'Centrifuge', price: 0, change: 0, tvl: '280M', history: [0.6, 0.61, 0.63, 0.62, 0.64] },
    { id: 'maple', symbol: 'MPL', name: 'Maple Finance', price: 0, change: 0, tvl: '150M', history: [14, 14.2, 14.1, 13.9, 14.5] },
    { id: 'goldfinch', symbol: 'GFI', name: 'Goldfinch', price: 0, change: 0, tvl: '100M', history: [3.2, 3.3, 3.1, 3.4, 3.5] },
  ]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 获取价格 (CoinGecko)
  const fetchPrices = async () => {
    try {
      const ids = assets.map(a => a.id).join(',');
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
      const data = await res.json();

      setAssets(prev => prev.map(asset => {
        const newPrice = data[asset.id]?.usd || asset.price;
        const newChange = data[asset.id]?.usd_24h_change || 0;
        // 模拟走势图更新
        const newHistory = [...asset.history.slice(1), newPrice]; 
        return { ...asset, price: newPrice, change: newChange, history: newHistory };
      }));
    } catch (e) { console.error("Price fetch failed", e); }
  };

  // 2. 获取新闻 (CryptoCompare)
  const fetchNews = async () => {
    try {
      const res = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
      const data = await res.json();
      setNews(data.Data.slice(0, 6)); // 取前6条
    } catch (e) { console.error("News fetch failed", e); }
  };

  useEffect(() => {
    // 初始化加载
    Promise.all([fetchPrices(), fetchNews()]).then(() => setLoading(false));
    
    // 定时刷新价格 (每10秒)
    const timer = setInterval(fetchPrices, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-md fixed w-full z-50 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">RWA Radar</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {loading && <RefreshCw className="w-4 h-4 animate-spin text-gray-500" />}
            <button className="bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors">
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <div className="text-gray-400 text-sm mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> RWA Market Cap</div>
            <div className="text-3xl font-bold">$9.42 Billion</div>
            <div className="text-green-400 text-sm mt-1">+4.2% Today</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <div className="text-gray-400 text-sm mb-2 flex items-center gap-2"><Shield className="w-4 h-4"/> Tokenized Treasuries</div>
            <div className="text-3xl font-bold">$1.2 Billion</div>
            <div className="text-green-400 text-sm mt-1">New Record</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <div className="text-gray-400 text-sm mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Avg. Yield (APY)</div>
            <div className="text-3xl font-bold">5.4%</div>
            <div className="text-gray-400 text-sm mt-1">Risk-Free Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Assets Table */}
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
                <Link href={`/asset/${asset.id}`} key={asset.id} className="block">
                  <div className="grid grid-cols-12 p-4 items-center hover:bg-white/5 transition-all border-b border-white/5 group cursor-pointer">
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

          {/* Right: News Feed */}
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-purple-500" /> Latest News
            </h2>
            <div className="space-y-4">
              {news.map((item: any) => (
                <a key={item.id} href={item.url} target="_blank" className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded uppercase">
                      {item.source_info?.name}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(item.published_on * 1000).getHours()}:00
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-300 group-hover:text-white line-clamp-2">
                    {item.title}
                  </h3>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
