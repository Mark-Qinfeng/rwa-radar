"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Globe, Newspaper, Activity, Search, ArrowUpRight, ArrowDownRight, Filter, Zap, ShieldCheck } from 'lucide-react';

// 模拟数据 - 实际开发中这里会替换为 API 请求
const MOCK_PROJECTS = [
  { id: 1, name: 'Ondo Finance', ticker: 'OUSG', category: 'US Treasury', tvl: 450000000, apy: 5.1, price: 102.4, change: 0.2, trend: 'hot' },
  { id: 2, name: 'MakerDAO', ticker: 'MKR', category: 'Stablecoin/RWA', tvl: 8200000000, apy: 0, price: 2100, change: -1.5, trend: 'stable' },
  { id: 3, name: 'Centrifuge', ticker: 'CFG', category: 'Private Credit', tvl: 280000000, apy: 8.5, price: 0.65, change: 5.2, trend: 'up' },
  { id: 4, name: 'Goldfinch', ticker: 'GFI', category: 'Emerging Markets', tvl: 110000000, apy: 12.4, price: 3.20, change: 1.1, trend: 'stable' },
  { id: 5, name: 'RealT', ticker: 'REAL', category: 'Real Estate', tvl: 85000000, apy: 9.2, price: 50.1, change: 0.0, trend: 'new' },
  { id: 6, name: 'Maple', ticker: 'MPL', category: 'Institutional Credit', tvl: 150000000, apy: 10.1, price: 14.2, change: 3.4, trend: 'hot' },
];

const MOCK_NEWS = [
  { id: 1, title: "BlackRock launches tokenized fund on Ethereum", source: "Bloomberg", time: "2h ago", sentiment: "positive" },
  { id: 2, title: "Ondo Finance expands to Solana ecosystem", source: "CoinDesk", time: "4h ago", sentiment: "positive" },
  { id: 3, title: "Regulatory framework for stablecoins discussed in EU", source: "The Block", time: "6h ago", sentiment: "neutral" },
];

// 简单的数字格式化工具
const formatMoney = (value: number) => {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState(MOCK_PROJECTS);

  // 简单的搜索过滤逻辑
  useEffect(() => {
    const filtered = MOCK_PROJECTS.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProjects(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Globe className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              RWA Radar
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Assets</a>
            <a href="#" className="hover:text-white transition-colors">News</a>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all border border-slate-700">
            Connect Wallet
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={60} />
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Market Cap</p>
            <h3 className="text-3xl font-bold mt-2 text-white">$12.45 B</h3>
            <div className="flex items-center mt-2 text-green-400 text-sm font-medium">
              <TrendingUp size={14} className="mr-1"/> +4.2% <span className="text-slate-500 ml-2 font-normal">vs last 24h</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Active Protocols</p>
            <h3 className="text-3xl font-bold mt-2 text-white">142</h3>
            <div className="flex items-center mt-2 text-blue-400 text-sm">
              <Zap size={14} className="mr-1"/> 12 New Listings
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center">
             <div className="flex items-center gap-2 mb-3">
                <Activity size={16} className="text-orange-500"/> 
                <span className="text-slate-200 font-medium">Trending Now</span>
             </div>
             <div className="flex flex-wrap gap-2">
                {['Ondo', 'Maple', 'Backed', 'RealT'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700 hover:border-slate-500 cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Asset List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-white">RWA Assets</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search tokens..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-slate-600"
                  />
                </div>
                <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400">
                  <Filter size={18}/>
                </button>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-semibold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4 pl-6">Asset</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">TVL</th>
                      <th className="p-4 text-right">APY</th>
                      <th className="p-4 text-right pr-6">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-800/50 transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:border-blue-500/50 group-hover:text-white transition-colors">
                              {project.ticker[0]}
                            </div>
                            <div>
                              <div className="font-medium text-slate-200">{project.name}</div>
                              <div className="text-slate-500 text-xs flex items-center gap-1">
                                {project.ticker}
                                {project.trend === 'hot' && <span className="text-[10px] bg-orange-500/10 text-orange-400 px-1 rounded">HOT</span>}
                                {project.trend === 'new' && <span className="text-[10px] bg-green-500/10 text-green-400 px-1 rounded">NEW</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            {project.category}
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono text-slate-300">{formatMoney(project.tvl)}</td>
                        <td className="p-4 text-right font-mono text-green-400 font-medium">{project.apy > 0 ? `${project.apy}%` : '-'}</td>
                        <td className="p-4 text-right pr-6">
                          <div className="font-mono text-slate-200">${project.price}</div>
                          <div className={`text-xs flex items-center justify-end mt-0.5 ${project.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {project.change >= 0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                            {Math.abs(project.change)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {projects.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No assets found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AI Insight Card */}
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>
              <h3 className="text-indigo-300 text-sm font-bold mb-3 flex items-center gap-2">
                 <Zap size={16} className="fill-indigo-500/20"/> AI Market Insight
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Institutional interest in <span className="text-white font-medium">Private Credit</span> is surging. Our algorithms detected a 15% increase in wallet interactions for Centrifuge and Maple protocols over the last 48 hours.
              </p>
              <div className="mt-4 pt-4 border-t border-indigo-500/20 flex justify-between items-center text-xs text-indigo-400/80">
                <span>Updated: 10m ago</span>
                <span className="flex items-center gap-1"><ShieldCheck size={12}/> Verified Source</span>
              </div>
            </div>

            {/* News Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
                <Newspaper size={18} /> Latest News
              </h3>
              <div className="space-y-4">
                {MOCK_NEWS.map((item) => (
                  <a key={item.id} href="#" className="block group">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span className="group-hover:text-blue-400 transition-colors">{item.source}</span>
                      <span>{item.time}</span>
                    </div>
                    <h4 className="text-sm text-slate-300 group-hover:text-white transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <div className="mt-2 flex gap-2">
                       <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                         item.sentiment === 'positive' ? 'border-green-900 text-green-500 bg-green-900/10' : 
                         'border-slate-700 text-slate-500 bg-slate-800'
                       }`}>
                         {item.sentiment}
                       </span>
                    </div>
                  </a>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-xs text-slate-500 hover:text-slate-300 border border-dashed border-slate-800 hover:border-slate-600 rounded-lg transition-all">
                View All News
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}