class PipeChartPainter {
  cpuEl = document.querySelector('#diskTotal');
  #myChart;
  _data = { datasets: [{
      backgroundColor: ['#e72c2c', '#62c941'],
      data: [0, 100]
    }],

    labels: [
      'used',
      'free',
    ]
  };
  _options = {
    label: 'test label'
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

  addDataset() {

  }

  addValue(dataset, nr, value) {
    this.#myChart.data.datasets[dataset].data[nr] = value;
  }
}



fetch('/disk')
  .then(response => response.json())
  .then(data => {
    const a = new PipeChartPainter();
    console.log(data)
  });
