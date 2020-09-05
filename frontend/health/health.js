import { Socket } from './socket.js';
import { PipeChartPainter } from './disk/disk-chart.js';

document.addEventListener('DOMContentLoaded', function () {
  new Socket();

  const pipeChart = new PipeChartPainter();
  fetch('/disk')
    .then((response) => response.json())
    .then((data) => {
      data.usage.forEach((usage) => {
        pipeChart.addDataset(usage.filesystem, usage.used, usage.available);
      });
    });
});
