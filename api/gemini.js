import axios from 'axios';

const hash = new Map();
export default async function fetchGeminiPrices(cache) {
  const fetchGeminiData = await Promise.all([
    axios.get('https://api.gemini.com/v2/ticker/btcusd'),
    axios.get('https://api.gemini.com/v2/ticker/ethusd'),
  ]);
  const geminiData = await Promise.all(fetchGeminiData.map((r) => r.data));
  geminiData.forEach((coin) => {
    let price = coin.bid;
    let ticker = coin.symbol;
    ticker = ticker.slice(0, 3);
    let sellerObj = {};
    sellerObj.type = 'seller';
    sellerObj.source = 'Gemini';
    sellerObj['name'] = ticker;
    sellerObj['price'] = price;
    let hashName = `${ticker}-${sellerObj.type}`;
    sellerObj.change = 0;
    if (hash.has(hashName)) {
      const previous = hash.get(hashName);
      let change = sellerObj.price - previous.price;
      sellerObj.change = change;
    }
    hash.set(hashName, sellerObj);
    cache.data.push(sellerObj);
    let buyerObj = {};

    price = coin.ask;
    buyerObj.type = 'buyer';
    buyerObj.source = 'Gemini';
    buyerObj['name'] = ticker;
    buyerObj['price'] = price;
    buyerObj.change = 0;
    hashName = `${ticker}-${buyerObj.type}`;
    if (hash.has(hashName)) {
      const previous = hash.get(hashName);
      let change = buyerObj.price - previous.price;
      buyerObj.change = change;
    }
    hash.set(hashName, buyerObj);
    cache.data.push(buyerObj);
  });
}
