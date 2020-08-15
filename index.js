import { connectCPU, disconnectCPU, startCPU, stopCPU } from './src/connectCPU.js';
import express from 'express';
import { createServer } from 'http';
import socket from 'socket.io';

const app = express();
const http = createServer(app);
const io = socket(http);

app.use(express.static('public'));

connectCPU(io);

io.on('connection', (socket) => {
  startCPU();
  socket.on('disconnect', () => {
    io.clients((err, clients) => {
      if (!clients.length || err) {
        stopCPU();
      }
    });
  });
});

http.on('close', () => {
  disconnectCPU();
});

http.listen(3000, () => {
  console.log('Server running on port 3000');
});
