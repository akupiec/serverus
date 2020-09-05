import { ChartPainter } from './cpu-indicator-chart.js';

export class Socket {
  socket = io();
  chart = new ChartPainter();

  constructor() {
    this.socket.on('data', (data) => {
      this.initDatasets(data);
      this.updateData(data);
    });
  }

  initDatasets(data) {
    if (this.chart.numOfDatasets() === 0) {
      data.forEach((d, idx) => {
        if (idx === 0) {
          this.chart.addDataset('total cpu', '#f53794', 'rgba(239,199,204,0.3)', true);
        }
        this.chart.addDataset('cpu ' + d.cpu);
      });
    }
  }

  updateData(data) {
    const label = '';
    const dataset = data.map((d) => {
      return d.usrLoad + d.niLoad + d.syLoad;
    });
    this.chart.addPoint(label, dataset);
  }
}
