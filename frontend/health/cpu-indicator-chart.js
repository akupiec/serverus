export class ChartPainter {
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
