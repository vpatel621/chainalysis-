import fetchCoinbasePrices from './coinbase.js';
import fetchGeminiPrices from './gemini.js';

export default async function currentMarketPrices(cache) {
  cache.data = [];

  fetchCoinbasePrices(cache);
  fetchGeminiPrices(cache);

  cache.data.sort((a, b) => a.price - b.price);

  setTimeout(() => {
    currentMarketPrices(cache);
  }, 3000);
}
