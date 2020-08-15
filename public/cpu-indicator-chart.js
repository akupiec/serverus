class ChartPainter {
  #config = {
    type: 'line',
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [{}],
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

var COLORS = [
  // '#4dc9f6',
  // '#f67019',
  // '#537bc4',
  // '#acc236',
  // '#166a8f',
  // '#00a950',
  // '#58595b',
  // '#8549ba',
];

class Socket {
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
        this.chart.addDataset('cpu ' + d.cpu, COLORS[idx - 1]);
      });
    }
  }
  updateData(data) {
    const time = Date.now();
    const dataset = data.map((d) => {
      return d.usrLoad + d.niLoad + d.syLoad;
    });
    this.chart.addPoint(time, dataset);
  }
}

new Socket();
