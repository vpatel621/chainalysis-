import { WebSocketServer } from 'ws';
import uuid from 'uuid';

export default function webSocketServer(server, cache) {
  const wss = new WebSocketServer({ server });
  const clients = new Map();
  wss.on('connection', (ws) => {
    const id = uuid.v4();
    const value = Math.floor(Math.random() * 1000);
    const metadata = { id, value };

    clients.set(ws, metadata);

    ws.on('message', (message) => {
      ws.send(`Hello, you sent -> ${message}`);
    });

    ws.send('Hi there, I am a WebSocket server :)');
    ws.send(JSON.stringify(cache));

    const broadcast = function () {
      if (cache.data.length === 8) {
        const json = JSON.stringify(cache);
        [...clients.keys()].forEach((client) => {
          client.send(json);
          console.log(json);
        });
      }
      setTimeout(() => {
        broadcast();
      }, 3000);
    };
    broadcast();
    ws.on('close', () => {
      clients.delete(ws);
    });
  });
}
