import express from 'express';
import cors from 'cors';
import { corsOptions } from './server/cors.js';

import currentMarketPrices from './api/currentMarketPrices.js';
import fetchHistoricalData from './api/historicalData.js';
import {
  useServerSentEventsMiddleware,
  streamPrices,
} from './server/sseMiddleware.js';

const app = express();
export const cache = { data: [], history: [] };

const startServer = () => {
  app.use(cors(corsOptions));

  currentMarketPrices(cache);
  fetchHistoricalData(cache);

  app.get('/', useServerSentEventsMiddleware, streamPrices);

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
  const server = app.listen(process.env.PORT || 3030, () => {
    console.log(`Server started on port ${server.address().port} :)`);
  });
};

startServer();
