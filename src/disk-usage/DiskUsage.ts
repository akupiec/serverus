import { exec } from 'child_process';
import { inDockerSys } from '../config';

const REFRESH_RATE = 10000;
const DF_COMMAND = inDockerSys ? 'df -B 1' : 'df --block-size=1';

export class DiskUsage {
  constructor(private readonly refreshRate = REFRESH_RATE) {}

  getDisksUsage(filesystems: string[]) {
    return new Promise((resolve, reject) => {
      exec(DF_COMMAND, (error, stdout, stderr) => {
        if (error || stderr) {
          reject({ error, stderr });
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
