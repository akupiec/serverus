import { exec } from 'child_process';
import { inDockerSys } from '../config';
import { IDiskSpaceUsage } from './iDiskStats';

const DF_COMMAND = inDockerSys ? 'df -B 1' : 'df --block-size=1';

export class DiskUsage {
  getDisksUsage(filesystems: RegExp): Promise<IDiskSpaceUsage[]> {
    return new Promise((resolve, reject) => {
      exec(DF_COMMAND, (error, stdout, stderr) => {
        if (error || stderr) {
          reject({ error, stderr });
        }
        const lines = stdout
          .split('\n')
          .slice(1)
          .map((line) => line.split(' ').filter((col) => col))
          .filter((lines) => lines.length);
        const diskSpaceUsages = lines
          .map(([filesystem, total, used, available, percentage, path]) => {
            return {
              filesystem,
              total: Number(total),
              used: Number(used),
              available: Number(available),
              percentage,
              path,
            };
          })
          .filter((usage) => (filesystems ? usage.filesystem.match(filesystems) : true));
        resolve(diskSpaceUsages);
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
