import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import axios from 'axios';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const startServer = () => {
  app.use(express.json());
  //For parsing application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  const coinbaseStore = { buyer: [], seller: [] };
  async function buy() {
    const purchase = await Promise.all([
      axios.get('https://api.coinbase.com/v2/prices/BTC-USD/buy'),
      axios.get('https://api.coinbase.com/v2/prices/ETH-USD/buy'),
    ]);
    const data = await Promise.all(purchase.map((r) => r.data));
    coinbaseStore.buyer = [];
    data.forEach((crypto) => {
      let price = crypto.data.amount;
      let curr = crypto.data.base;
      let obj = {};
      obj.type = 'buyer';
      obj.source = 'coinbase';
      obj['name'] = curr;
      obj['price'] = price;
      coinbaseStore.buyer.push(obj);
    });

    setTimeout(() => {
      buy();
    }, 20000);
  }
  async function sell() {
    const purchase = await Promise.all([
      axios.get('https://api.coinbase.com/v2/prices/BTC-USD/sell'),
      axios.get('https://api.coinbase.com/v2/prices/ETH-USD/sell'),
    ]);
    const data = await Promise.all(purchase.map((r) => r.data));
    coinbaseStore.seller = [];
    data.forEach((crypto) => {
      let price = crypto.data.amount;
      let curr = crypto.data.base;
      let obj = {};
      obj.type = 'seller';
      obj.source = 'coinbase';
      obj['name'] = curr;
      obj['price'] = price;
      coinbaseStore.seller.push(obj);
    });

    setTimeout(() => {
      sell();
    }, 20000);
  }

  buy();
  sell();

  //error handling

  wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    console.log('hi');
    ws.on('message', (message) => {
      //log the received message and send it back to the client
      console.log('received: %s', message);
      ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server :)');
    ws.send(JSON.stringify(coinbaseStore));
    var broadcast = function () {
      var json = JSON.stringify(coinbaseStore);

      // wss.clients is an array of all connected clients
      wss.clients.forEach(function each(client) {
        client.send(json);
        console.log(`sent:${json}`);
      });
      setTimeout(() => {
        broadcast();
      }, 20000);
    };
    broadcast();
  });

  app.use(function (err, req, res, next) {
    if ((err.status = '401')) {
      console.log(err);
      res.status(err.status).send({ error: 'Unathorized user' });
    } else {
      next();
    }
  });
  app.use(function (err, req, res, next) {
    console.log(err);
    res.status('500').send({ error: 'Internal Server Error' });
  });

  //starting our server on a port
  const PORT = process.env.PORT || 3030;
  server.listen(process.env.PORT || 3030, () => {
    console.log(`Server started on port ${server.address().port} :)`);
  });
};
startServer();
