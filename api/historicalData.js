import axios from 'axios';
export default async function historicalData(cache) {
  try {
    cache.history = [];
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily'
    );
    let { data } = res;
    data.name = 'BTC';
    cache.history.push(data);
    let res2 = await axios.get(
      'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30&interval=daily'
    );

    res2.data.name = 'ETH';
    cache.history.push(res2.data);
    setTimeout(() => {
      historicalData();
    }, 86400000);
  } catch (err) {
    console.log(err);
  }
}
