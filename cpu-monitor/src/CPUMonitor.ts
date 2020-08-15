import * as fs from 'fs';
import { EventEmitter } from 'events';
import { ICPUStats } from './iCPUStats';

const BUFFER_SIZE = 1000;
const REFRESH_RATE = 5000;

export class CPUMonitor {
  private interval;
  private timeout;
  private fileHandler;
  private isConnected = false;
  private bufferPrev = new Buffer(BUFFER_SIZE);
  private bufferNew = new Buffer(BUFFER_SIZE);
  private event = new EventEmitter();
  private refreshRate;

  constructor(refreshRate = REFRESH_RATE) {
    this.refreshRate = refreshRate;
    fs.open('/proc/stat', 'r', (err, fd) => {
      this.fileHandler = fd;
    });
  }

  private readProcStatus() {
    const fd = this.fileHandler;
    if (!this.isConnected) {
      return;
    }
    fs.read(fd, this.bufferNew, 0, BUFFER_SIZE, 0, () => {
      if (this.bufferPrev.indexOf(0) !== 0) {
        const loadsPrev = this.bufferToLoads(this.bufferPrev);
        const loadsNew = this.bufferToLoads(this.bufferNew);
        const cpuStats = this.getCpuStats(loadsNew, loadsPrev);
        this.event.emit('event', cpuStats);
      }
      this.bufferNew.copy(this.bufferPrev);
    });
    this.timeout = setTimeout(() => {
      this.readProcStatus();
    }, this.refreshRate);
  }

  private getCpuStats(loadsNew: number[][], loadsPrev: number[][]): ICPUStats[] {
    return loadsNew.map((x, idx) => {
      return {
        cpu: idx === 0 ? 'all' : idx,
        ...CPUMonitor.parseLoads(loadsNew[idx], loadsPrev[idx]),
      };
    });
  }

  private static parseLoads(a, b): Omit<ICPUStats, 'cpu'> {
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
      usrLoad: Number((usrLoad * 100) / total), //percentage of time spend in user mode
      niLoad: Number((niLoad * 100) / total), // percentage of time spend in low priority mode (nice)
      syLoad: Number((syLoad * 100) / total), // percentage of time spend in system mode
      idleLoad: Number((idleLoad * 100) / total), // percentage of idle time spend
    };
  }

  private bufferToLoads(buff) {
    const cpus = buff
      .toString()
      .split('\n')
      .filter((a) => a.includes('cpu'));
    return cpus.map((c) => {
      return c
        .split(' ')
        .filter((col) => col)
        .slice(1, 5)
        .map((v) => Number(v));
    });
  }

  private pauseOnNoUsers(io: any, socket: any) {
    socket.on('disconnect', () => {
      io.clients((err, clients) => {
        if (!clients.length || err) {
          this.isConnected = false;
        }
      });
    });
  }

  connect(io) {
    io.on('connection', (socket) => {
      this.startReadingStats();
      this.pauseOnNoUsers(io, socket);
    });

    this.event.on('event', (data) => {
      io.emit('data', data);
    });
  }

  private startReadingStats() {
    if (this.isConnected) {
      return;
    }
    this.isConnected = true;
    this.readProcStatus();
  }

  disconnect() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
    fs.closeSync(this.fileHandler);
    this.event.removeAllListeners();
  }
}
