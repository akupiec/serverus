function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + ' ' + units[u];
}

class PipeChartPainter {
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
      type: 'doughnut',
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

const a = new PipeChartPainter();
fetch('/disk')
  .then((response) => response.json())
  .then((data) => {
    data.usage.forEach((usage) => {
      a.addDataset(usage.filesystem, usage.used, usage.available);
    });
  });
