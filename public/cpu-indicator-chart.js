class ChartPainter {
  #config = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        //   {
        //   label: 'My First dataset',
        //   backgroundColor: window.chartColors.red,
        //   borderColor: window.chartColors.red,
        //   data: [
        //     randomScalingFactor(),
        //     randomScalingFactor(),
        //     randomScalingFactor(),
        //   ],
        //   fill: false,
        // },
      ],
    },
    options: {
      responsive: true,
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

  // addDataset(id, lineLabel, nextColor = false) {
  //   this.#datasets.push({
  //     id, label: lineLabel, data: [],
  //     backgroundColor: window.chartColors.red,
  //     borderColor: window.chartColors.red,
  // fill: false,
  // });
  // }

  addPoint(timestamp, dataset) {
    this._labels.push(timestamp);
    dataset?.forEach((d, index) => {
      this._datasets[index].data = d;
    });
    this.#myChart.update();
  }
}

class Socket {
  socket = io();
  chart = new ChartPainter();

  constructor() {
    this.socket.on('data', (data) => {
      this.chart.cpuEl.innerText = JSON.stringify(data);
    });
  }
}

new Socket();
