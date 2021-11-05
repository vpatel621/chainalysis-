import fetchCoinbasePrices from './coinbase.js';
import fetchGeminiPrices from './gemini.js';
import SSEChannel from 'sse-pubsub';

export const channel = new SSEChannel();

export default async function currentMarketPrices(cache) {
  cache.data = [];

  await fetchCoinbasePrices(cache);
  await fetchGeminiPrices(cache);

  cache.data.sort((a, b) => a.price - b.price);
  channel.publish(cache, 'CACHE_UPDATE');
  setTimeout(() => {
    currentMarketPrices(cache);
  }, 2000);
}
