class PipeChartPainter {
  cpuEl = document.querySelector('#cpu2');
  #myChart;
  _data = { datasets: [{ data: [] }] };
  _options = {
    elements: {
      arc: {
        backgroundColor: this._colorize.bind(this, false, false),
        hoverBackgroundColor: this._hoverColorize.bind(this),
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

  _colorize(opaque, hover, ctx) {
    const v = ctx.dataset.data[ctx.dataIndex];
    const opacity = hover ? 1 - Math.abs(v / 150) - 0.2 : 1 - Math.abs(v / 150);
    return Chart.helpers
      .color()
      .hsv(100 - v, 100, 80)
      .rgbString();
  }

  _transparentize(color, opacity) {
    const alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return Chart.helpers.color(color).alpha(alpha).rgbString();
  }

  _hoverColorize(ctx) {
    return this._colorize(false, true, ctx);
  }

  addPoint(labels, dataset) {
    this._data.datasets[0].data = dataset;
    this._data.datasets[0].labels = labels;
    this.#myChart.update();
  }
}

class ChartPainter {
  #config = {
    type: 'line',
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      responsive: true,
      width: '50%',
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
  };
  cpuEl = document.querySelector('#cpu');
  #myChart;

  constructor() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    this.#myChart = new Chart(ctx, this.#config);
    this.cpuEl.appendChild(canvas);
  }

  get _datasets() {
    return this.#config.data.datasets;
  }

  get _labels() {
    return this.#config.data.labels;
  }

  addDataset(lineLabel, borderColor, backgroundColor, fill = false) {
    this._datasets.push({
      label: lineLabel,
      data: [],
      backgroundColor,
      borderColor,
      fill: fill,
      pointStyle: 'line',
    });
  }

  addPoint(timestamp, dataset) {
    this._labels.push(timestamp);
    dataset?.forEach((d, index) => {
      this._datasets[index].data.push(d);
    });
    this.#myChart.update();
  }

  numOfDatasets() {
    return this._datasets.length;
  }
}

class Socket {
  socket = io();
  chart = new ChartPainter();
  pipeChart = new PipeChartPainter();

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
    const datasetLabels = data.map((d) => d.cpu);
    this.chart.addPoint(label, dataset);
    this.pipeChart.addPoint(datasetLabels, dataset);
  }
}

new Socket();
