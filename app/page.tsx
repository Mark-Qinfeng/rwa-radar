"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Activity, Shield, TrendingUp, Clock, Newspaper, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ASSET_CONFIG } from './config'; // 导入配置文件

// 定义数据结构
interface AssetData {
  id: string;
  defillamaId: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  tvl: string;
  history: number[];
}

export default function Home() {
  // 1. 初始化状态：先用配置生成空数据
  const [assets, setAssets] = useState<AssetData[]>(() => {
    return ASSET_CONFIG.map(item => ({
      ...item,
      price: 0,
      change: 0,
      tvl: '-',
      history: [0, 0, 0, 0, 0]
    }));
  });
  
  const [news, setNews] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // 专门控制转圈圈的状态

  // 辅助函数：格式化 TVL
  const formatTVL = (num: number) => {
    if (!num) return '-';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    return `$${num.toLocaleString()}`;
  };

  // 核心：获取数据并处理缓存
  const fetchAllData = async () => {
    setIsUpdating(true);
    try {
      // --- A. 获取价格 ---
      const ids = ASSET_CONFIG.map(a => a.id).join(',');
      const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
      
      // 如果 API 限制，抛出错误，直接跳到 catch，保留旧数据
      if (!priceRes.ok) throw new Error('Rate Limit'); 
      
      const priceData = await priceRes.json();

      // --- B. 获取 TVL (并行) ---
      const tvlPromises = ASSET_CONFIG.map(async (asset) => {
        try {
          const res = await fetch(`https://api.llama.fi/tvl/${asset.defillamaId}`);
          return { id: asset.id, val: await res.json() };
        } catch {
          return { id: asset.id, val: null };
        }
      });
      const tvlResults = await Promise.all(tvlPromises);

      // --- C. 合并数据 ---
      setAssets(prevAssets => {
        const newAssets = prevAssets.map(asset => {
          const newPrice = priceData[asset.id]?.usd || asset.price;
          const newChange = priceData[asset.id]?.usd_24h_change || asset.change;
          
          // 只有当价格有效时才更新历史
          let newHistory = asset.history;
          if (newPrice > 0) {
             // 简单的平滑处理：如果历史全是0，就填满当前价格，否则追加
             const validHistory = asset.history[0] === 0 ? Array(5).fill(newPrice) : asset.history;
             newHistory = [...validHistory.slice(1), newPrice];
          }

          const tvlItem = tvlResults.find(t => t.id === asset.id);
          const newTvl = tvlItem && tvlItem.val ? formatTVL(tvlItem.val) : asset.tvl;

          return {
            ...asset,
            price: newPrice,
            change: newChange,
            tvl: newTvl,
            history: newHistory
          };
        });

        // *** 关键：保存到本地缓存 ***
        localStorage.setItem('cachedAssets', JSON.stringify(newAssets));
        localStorage.setItem('lastUpdate', new Date().toISOString());
        
        return newAssets;
      });

      setLastUpdate(new Date());

    } catch (error) {
      console.warn("API 繁忙，使用缓存数据");
    } finally {
      setIsUpdating(false);
    }
  };
  

// 获取新闻 (中文版 + 智能筛选)
// 修复版：带错误检查和自动回退的新闻获取
  const fetchNews = async () => {
    try {
      const symbols = ASSET_CONFIG.map(a => a.symbol).join(',');
      // 尝试获取筛选后的新闻
      const res = await fetch(`https://min-api.cryptocompare.com/data/v2/news/?lang=ZH&categories=${symbols},DeFi,Ethereum`);
      const data = await res.json();
      
      // 关键修复：先检查 data.Data 到底是不是一个数组
      if (data.Data && Array.isArray(data.Data)) {
        setNews(data.Data.slice(0, 6));
      } else {
        console.warn("按币种筛选新闻失败，正在切换回通用新闻...");
        // 如果筛选失败（API返回了非数组数据），自动回退到获取通用新闻
        const fallbackRes = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=ZH');
        const fallbackData = await fallbackRes.json();
        
        if (fallbackData.Data && Array.isArray(fallbackData.Data)) {
          setNews(fallbackData.Data.slice(0, 6));
        }
      }
    } catch (e) { 
      console.error("News fetch error", e); 
      // 出错时保持空数组，防止页面崩溃
      setNews([]);
    }
  };


  useEffect(() => {
    // 1. 页面加载瞬间：先尝试从 localStorage 读取缓存
    const cached = localStorage.getItem('cachedAssets');
    const cachedTime = localStorage.getItem('lastUpdate');
    
    if (cached) {
      setAssets(JSON.parse(cached));
      if (cachedTime) setLastUpdate(new Date(cachedTime));
    }

    // 2. 然后发起网络请求去更新 (用户已经看到缓存数据了，不会觉得卡)
    fetchAllData();
    fetchNews();

    // 3. 定时器
    const timer = setInterval(fetchAllData, 15000); // 改为 15秒，避免太频繁被封
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
               {isUpdating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
               <span>Updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Waiting...'}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Stats - 静态展示，后续也可以做成动态 */}
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
              <Newspaper className="w-5 h-5 text-purple-500" /> 
              {/* 改成中文标题 */}
              最新资讯 (24h)
            </h2>
            <div className="space-y-4">
              {news.length > 0 ? news.map((item: any) => (
                <a key={item.id} href={item.url} target="_blank" className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded uppercase">
                      {item.source_info?.name || 'News'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 
                      {/* 简单的格式化时间 */}
                      {new Date(item.published_on * 1000).getHours()}:00
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-300 group-hover:text-white line-clamp-2">
                    {/* 这里的 title 自动就是中文了 */}
                    {item.title}
                  </h3>
                </a>
              )) : <div className="text-gray-500 text-sm">正在加载资讯...</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
