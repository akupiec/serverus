import fs from 'fs';
import EventEmitter from 'events';

let interval;
let timeout;
let fileHandler;
let isConnected = false;
const bufferPrev = new Buffer(1000);
const bufferNew = new Buffer(1000);

const event = new EventEmitter();
fs.open('/proc/stat', 'r', (err, fd) => {
  fileHandler = fd;
  interval = setInterval(() => {
    if (!isConnected) {
      return;
    }
    fs.read(fd, bufferPrev, 0, 1000, 0, () => {
      timeout = setTimeout(() => {
        fs.read(fd, bufferNew, 0, 1000, 0, () => {
          const loadsPrev = bufferToLoads(bufferPrev);
          const loadsNew = bufferToLoads(bufferNew);
          const cpus = loadsNew.map((x, idx) => {
            return { cpu: idx === 0 ? 'all' : idx, ...parseLoads(loadsNew[idx], loadsPrev[idx]) };
          });
          event.emit('event', cpus);
        });
      }, 3000);
    });
  }, 6000);
});

function parseLoads(a, b) {
  let bLoad = b[0] + b[1] + b[2];
  let aLoad = a[0] + a[1] + a[2];
  let bTotal = bLoad + b[3];
  let aTotal = aLoad + a[3];
  let usrLoad = b[0] - a[0];
  let syLoad = b[1] - a[1];
  let niLoad = b[2] - a[2];
  let idleLoad = b[3] - a[3];
  let total = bTotal - aTotal;
  return {
    usrLoad: Number((usrLoad * 100) / total).toPrecision(2), //percentage of time spend in user mode
    niLoad: Number((niLoad * 100) / total).toPrecision(2), // percentage of time spend in low priority mode (nice)
    syLoad: Number((syLoad * 100) / total).toPrecision(2), // percentage of time spend in system mode
    idleLoad: Number((idleLoad * 100) / total).toPrecision(2), // percentage of idle time spend
  };
}

function bufferToLoads(buff) {
  let cpus = buff
    .toString()
    .split('\n')
    .filter((a) => a.includes('cpu'));
  return cpus.map((c) =>
    c
      .split(' ')
      .filter((col) => col)
      .slice(1, 5)
      .map((v) => Number(v)),
  );
}

export function connectCPU(io) {
  event.on('event', (data) => {
    io.emit('data', data);
  });
}

export function startCPU() {
  isConnected = true;
}
export function stopCPU() {
  isConnected = false;
}

export function disconnectCPU() {
  clearInterval(interval);
  clearTimeout(timeout);
  fs.closeSync(fileHandler);
  event.close();
}
