import { EventEmitter } from 'events';
import { exec } from 'child_process';

const REFRESH_RATE = 10000;

export class DiskUsage {
  private event = new EventEmitter();
  private lastData: any;
  private isRunning = false;
  private interval: number;

  constructor(private readonly refreshRate = REFRESH_RATE) {}

  getDisksUsage() {
    return new Promise((resolve, reject) => {
      exec('df --block-size=1', (error, stdout, stderr) => {
        if (error || stderr) {
          reject(error);
        }
        const lines = stdout
          .split('\n')
          .slice(1)
          .map((line) => line.split(' ').filter((col) => col));
        const data = lines.map(([filesystem, total, used, available, percentage, path]) => {
          return { filesystem, total, used, available, percentage, path };
        });
        resolve(data);
      });
    });
  }

  getDirsUsage(paths: string) {
    return new Promise((resolve, reject) => {
      exec('du -b ' + paths, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(error);
        }
        console.log(stdout);
      });
    });
  }
}
