import { humanFileSize } from './utils.js';

export class PipeChartPainter {
  cpuEl = document.querySelector('#diskTotal');
  #myChart;
  _data = {
    datasets: [],
    labels: ['used', 'free'],
  };
  _options = {
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          let dataset = data.datasets[tooltipItem.datasetIndex];
          let label = dataset.label || '';

          label += ' ' + humanFileSize(dataset.data[tooltipItem.index], false, 2);
          return label;
        },
      },
    },
  };

  constructor() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    this.#myChart = new Chart(ctx, {
      type: 'pie',
      data: this._data,
      options: this._options,
    });
    this.cpuEl.appendChild(canvas);
  }

  addDataset(label, usage, free) {
    this.#myChart.data.datasets.push({
      backgroundColor: ['#e72c2c', '#62c941'],
      data: [usage, free],
      label,
    });
    this.#myChart.update();
  }

  addValue(dataset, nr, value) {
    this.#myChart.data.datasets[dataset].data[nr] = value;
    this.#myChart.update();
  }
}
