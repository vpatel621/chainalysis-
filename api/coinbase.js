import axios from 'axios';

const lastFetchData = new Map();
export default async function fetchCoinbasePrices(cache) {
  try {
    const fetchSellData = await Promise.all([
      axios.get('https://api.coinbase.com/v2/prices/BTC-USD/sell'),
      axios.get('https://api.coinbase.com/v2/prices/ETH-USD/sell'),
    ]);
    const sellData = fetchSellData.map((r) => r.data);

    const fetchBuyData = await Promise.all([
      axios.get('https://api.coinbase.com/v2/prices/BTC-USD/buy'),
      axios.get('https://api.coinbase.com/v2/prices/ETH-USD/buy'),
    ]);

    const buyData = fetchBuyData.map((r) => r.data);

    formatData(sellData, 'seller', 'Coinbase');
    formatData(buyData, 'buyer', 'Coinbase');
  } catch (err) {
    console.log(err);
  }

  function formatData(results, type, source) {
    results.forEach((coin) => {
      let price = coin.data.amount;
      let ticker = coin.data.base;
      let obj = {};

      obj.type = type;
      obj.source = source;
      obj['name'] = ticker;
      obj['price'] = price;
      obj.change = 0;
      let hashName = `${ticker}-${type}`;
      if (lastFetchData.has(hashName)) {
        const previous = lastFetchData.get(hashName);
        let change = price - previous.price;
        obj.change = change;
      }
      lastFetchData.set(hashName, obj);

      cache.data.push(obj);
    });
  }
}
