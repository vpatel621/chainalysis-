import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import currentMarketPrices from './api/currentMarketPrices.js';
import fetchHistoricalData from './api/historicalData.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const startServer = () => {
  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  const cache = { data: [], history: [] };

  currentMarketPrices(cache);
  fetchHistoricalData(cache);

  wss.on('connection', (ws) => {
    // connection is up, let's add a simple simple event
    ws.on('message', (message) => {
      //log the received message and send it back to the client
      ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server :)');
    ws.send(JSON.stringify(cache));

    const broadcast = function () {
      if (cache.data.length === 8) {
        const json = JSON.stringify(cache);

        // wss.clients is an array of all connected clients
        wss.clients.forEach(function each(client) {
          client.send(json);
          console.log(`sent:${json}`);
        });
      }
      setTimeout(() => {
        broadcast();
      }, 3000);
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
