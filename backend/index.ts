import * as express from 'express';
import { createServer } from 'http';
import * as socket from 'socket.io';
import { CPUMonitor } from './cpu-monitor/CPUMonitor';
import { DiskUsage } from './disk-usage/DiskUsage';
import { FILE_SYSTEMS } from './config';

const app = express();
const http = createServer(app);
const io = socket(http);

app.use(express.static('frontend'));

const cpuMonitor = new CPUMonitor(2000).connect(io);
const diskUsage = new DiskUsage();

http.on('close', () => {
  cpuMonitor.disconnect();
});

app.get('/disk', async (req, res) => {
  const disksUsage = diskUsage.getDisksUsage(FILE_SYSTEMS);
  Promise.all([disksUsage]).then(
    ([usage]) => {
      res.send({ usage });
    },
    (err) => {
      res.status(500);
      res.send(err);
    },
  );
});

http.listen(3000, () => {
  console.log('Server running on port 3000');
});
