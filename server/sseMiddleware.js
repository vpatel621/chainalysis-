// import { cache } from '../app.js';

// export const useServerSentEventsMiddleware = (req, res, next) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   res.flushHeaders();

//   const sendEventStreamData = (cache) => {
//     const responseData = `data: ${JSON.stringify(cache)}\n\n`;
//     res.write(responseData);
//   };

//   Object.assign(res, {
//     sendEventStreamData,
//   });

//   next();
// };

// export const streamPrices = (req, res) => {
//   const stream = setInterval(() => res.sendEventStreamData(cache), 500);

//   res.on('close', () => {
//     clearInterval(stream);
//     res.end();
//   });
// };
