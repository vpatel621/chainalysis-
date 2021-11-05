import express from 'express';
import cors from 'cors';
import http from 'http';

import currentMarketPrices from './api/currentMarketPrices.js';
import fetchHistoricalData from './api/historicalData.js';
import webSocketServer from './server/websocketServer.js';

const app = express();
const server = http.createServer(app);

const startServer = () => {
  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  const cache = { data: [], history: [] };
  webSocketServer(server, cache);
  currentMarketPrices(cache);
  fetchHistoricalData(cache);

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
