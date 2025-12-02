"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, Twitter, ExternalLink, Copy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AssetDetail() {
  const params = useParams();
  const id = params?.id as string; // 获取 URL 里的 id (比如 ondo-finance)
  
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // 模拟获取详情数据 (实际项目中这里会调用 API 获取该资产的详细介绍)
  useEffect(() => {
    // 1. 获取基础信息
    fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then(res => res.json())
      .then(info => setData(info));

    // 2. 获取历史走势 (模拟生成，因为免费 API 限制较多)
    const mockHistory = Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i+1}`,
      price: Math.random() * 10 + 100 // 假数据
    }));
    setHistory(mockHistory);
  }, [id]);

  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-white/10 px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div className="flex items-center gap-6">
            <img src={data.image?.large} alt={data.name} className="w-20 h-20 rounded-full border-2 border-white/10" />
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{data.name} <span className="text-gray-500 text-2xl">({data.symbol?.toUpperCase()})</span></h1>
              <div className="flex gap-3">
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">Rank #{data.market_cap_rank}</span>
                <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm">RWA</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm mb-1">Current Price</div>
            <div className="text-4xl font-mono font-bold">${data.market_data?.current_price?.usd}</div>
            <div className={`text-lg ${data.market_data?.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.market_data?.price_change_percentage_24h?.toFixed(2)}% (24h)
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 h-[400px]">
          <h3 className="text-lg font-bold mb-4 text-gray-400">Price Performance (30 Days)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderColor: '#333' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">About {data.name}</h3>
            <div className="text-gray-400 leading-relaxed text-sm" dangerouslySetInnerHTML={{__html: data.description?.en?.split('. ')[0] + '.'}}></div>
            
            <div className="mt-6 flex gap-4">
              {data.links?.homepage?.[0] && (
                <a href={data.links.homepage[0]} target="_blank" className="flex items-center gap-2 text-blue-400 hover:underline">
                  <Globe className="w-4 h-4" /> Website
                </a>
              )}
              {data.links?.twitter_screen_name && (
                <a href={`https://twitter.com/${data.links.twitter_screen_name}`} target="_blank" className="flex items-center gap-2 text-blue-400 hover:underline">
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Market Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Market Cap</span>
                <span className="font-mono">${data.market_data?.market_cap?.usd?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Total Volume (24h)</span>
                <span className="font-mono">${data.market_data?.total_volume?.usd?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Circulating Supply</span>
                <span className="font-mono">{data.market_data?.circulating_supply?.toLocaleString()} {data.symbol?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
