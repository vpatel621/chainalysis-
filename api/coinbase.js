import axios from 'axios';

const hashMap = new Map();
export default async function fetchCoinbasePrices(cache) {
  const fetchSellData = await Promise.all([
    axios.get('https://api.coinbase.com/v2/prices/BTC-USD/sell'),
    axios.get('https://api.coinbase.com/v2/prices/ETH-USD/sell'),
  ]);
  const sellData = await Promise.all(fetchSellData.map((r) => r.data));

  //try to combine buy and ask for coinbase into 1 function

  const fetchBuyData = await Promise.all([
    axios.get('https://api.coinbase.com/v2/prices/BTC-USD/buy'),
    axios.get('https://api.coinbase.com/v2/prices/ETH-USD/buy'),
  ]);

  const buyData = await Promise.all(fetchBuyData.map((r) => r.data));

  formatData(sellData, 'seller', 'Coinbase');
  formatData(buyData, 'buyer', 'Coinbase');

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
      if (hashMap.has(hashName)) {
        const previous = hashMap.get(hashName);
        let change = price - previous.price;
        obj.change = change;
      }
      hashMap.set(hashName, obj);

      cache.data.push(obj);
    });
  }
}
