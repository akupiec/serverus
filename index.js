import { CPUMonitor } from './cpu-monitor/build/CPUMonitor.js';
import express from 'express';
import { createServer } from 'http';
import socket from 'socket.io';
import { DiskUsage } from './disk-usage/build/DiskUsage.js';

const app = express();
const http = createServer(app);
const io = socket(http);

app.use(express.static('public'));

const cpuMonitor = new CPUMonitor(2000).connect(io);
const diskUsage = new DiskUsage();

http.on('close', () => {
  cpuMonitor.disconnect();
});

app.get('/disk', async (req, res) => {
  const disksUsage = diskUsage.getDisksUsage();
  Promise.all([disksUsage]).then(
    ([usage]) => {
      res.send({ usage });
    },
    (err) => res.send(500, err),
  );
});

http.listen(3000, () => {
  console.log('Server running on port 3000');
});
