import { CPUMonitor } from './cpu-monitor/build/CPUMonitor.js';
import express from 'express';
import { createServer } from 'http';
import socket from 'socket.io';

const app = express();
const http = createServer(app);
const io = socket(http);

app.use(express.static('public'));

const cpuMonitor = new CPUMonitor(2000).connect(io);

http.on('close', () => {
  cpuMonitor.disconnect();
});

http.listen(3000, () => {
  console.log('Server running on port 3000');
});
