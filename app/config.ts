// app/config.ts

export const ASSET_CONFIG = [
  { 
    id: 'ondo-finance',      // CoinGecko ID (去 coingecko 网址上看 URL 里的名字)
    defillamaId: 'ondo-finance', // DefiLlama ID (通常和上面一样，偶尔不同)
    symbol: 'ONDO', 
    name: 'Ondo Finance' 
  },
  { 
    id: 'tether-gold',      // CoinGecko ID (去 coingecko 网址上看 URL 里的名字)
    defillamaId: 'tether-gold', // DefiLlama ID (通常和上面一样，偶尔不同)
    symbol: 'XAUT', 
    name: 'Tether Gold' 
  },
  { 
    id: 'maker', 
    defillamaId: 'makerdao', 
    symbol: 'MKR', 
    name: 'MakerDAO' 
  },
  { 
    id: 'centrifuge', 
    defillamaId: 'centrifuge', 
    symbol: 'CFG', 
    name: 'Centrifuge' 
  },
  { 
    id: 'maple', 
    defillamaId: 'maple', 
    symbol: 'MPL', 
    name: 'Maple Finance' 
  },
  { 
    id: 'goldfinch', 
    defillamaId: 'goldfinch', 
    symbol: 'GFI', 
    name: 'Goldfinch' 
  },
  { 
    id: 'realtoken-ecosystem-governance-gold',      // CoinGecko ID (去 coingecko 网址上看 URL 里的名字)
    defillamaId: 'realt-tokens', // DefiLlama ID (通常和上面一样，偶尔不同)
    symbol: 'REG', 
    name: 'RealT' 
  },
  // 你可以在这里继续添加新的币种...
  // { id: 'truefi', defillamaId: 'truefi', symbol: 'TRU', name: 'TrueFi' },
];
