import type { Asset, Exchange } from '../types/core';

export const supportedAssets: Asset[] = [
  'BTC',
  'ETH',
  'SOL',
  'BNB',
  'DOGE',
  'XRP',
  'LTC'
];

export const basicAssets: Asset[] = ['BTC', 'ETH'];

export const supportedExchanges: Exchange[] = ['Binance', 'Bybit', 'OKX'];

export const getAssetSymbol = (asset: Asset, exchange: Exchange) => {
  if (exchange === 'OKX') {
    return `${asset}-USDT-SWAP`;
  }
  return `${asset}USDT`;
};
