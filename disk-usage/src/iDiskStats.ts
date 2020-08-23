export interface IDiskSpaceUsage {
  filesystem: string;
  total: number; // in bytes
  used: number; // in bytes
  available: number; // in bytes
  percentage?: string;
  path?: string;
}

export interface IDirSize {
  dirPath: string;
  blocks: number; // in bytes
  user: number; // in bytes
  available: number; // in bytes
}
