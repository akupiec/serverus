export interface ICPUStats {
  cpu: 'all' | number, // cpu index or total usage
  usrLoad: number; //percentage of time spend in user mode
  niLoad: number; // percentage of time spend in low priority mode (nice)
  syLoad: number; // percentage of time spend in system mode
  idleLoad: number; // percentage of idle time spend
}
