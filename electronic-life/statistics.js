/**
 * This is to render the Population Chart (using chart.js).
 * The x-axis holds the day count.
 * The y-axis holds the population of the interested actors.
 */

let statsCanvas;
let limit = 100;
let statsData;
let statsColor;
let statsHoverColor;
let chartData;

let statsLineChart;

Chart.defaults.global.defaultFontColor = 'white';

let chartOption = {
	showLines: true,
  animation: false,
  scales: {
    xAxes: [{
      ticks: {
        maxTicksLimit: 10
      }
    }]
  }
};

/**
 * Called first time the page loads
 */
function initStats() {
  statsCanvas = document.getElementById('statsChart');
  resetStats();
}

/**
 * Called everytime the world is launched
 */
function resetStats() {
  if (statsLineChart != null) {
    statsLineChart.destroy(); // otherwise weird things happen to the chart
  }

  resetStatsLabelAndColors();
  
  statsLineChart = Chart.Line(statsCanvas,{
    data: createChartData(),
    options: chartOption
  });
}

/**
 * Based on world initializes the label and color
 */
function resetStatsLabelAndColors() {
  switch(envChoice) {
    case 'moving':
      statsData = [Fly.TYPE, Turtle.TYPE];
      statsColor = [SketchColor.skyblue().stringify(), SketchColor.greenyellow().stringify()];
      statsHoverColor = [SketchColor.blue().stringify(), SketchColor.green().stringify()];
      statsBgColor = [
        SketchColor.skyblue().alpha(0.4).stringify(),
        SketchColor.greenyellow().alpha(0.4).stringify()
      ];
      break;
    case 'living':
      statsData = [Lily.TYPE, Worm.TYPE];
      statsColor = [SketchColor.greenyellow().stringify(), SketchColor.skyblue().stringify()];
      statsHoverColor = [SketchColor.green().stringify(), SketchColor.blue().stringify()];
      statsBgColor = [
        SketchColor.skyblue().alpha(0.4).stringify(),
        SketchColor.greenyellow().alpha(0.4).stringify()
      ];
      if (choice_fish != 1) {
        statsData.push(Fish.TYPE);
        statsColor.push(SketchColor.white().stringify());
        statsHoverColor.push(SketchColor.yellow().stringify());
        statsBgColor.push(SketchColor.white().alpha(0.4).stringify());
      }
      break;
    case 'symbotic':
      statsData = [Lily.TYPE, Fly.TYPE];
      statsColor = [SketchColor.greenyellow().stringify(), SketchColor.skyblue().stringify()];
      statsHoverColor = [SketchColor.green().stringify(), SketchColor.blue().stringify()];
      statsBgColor = [
        SketchColor.greenyellow().alpha(0.4).stringify(),
        SketchColor.skyblue().alpha(0.4).stringify()
      ];
      break;
  }
}

/**
 * Initializes the chart data that will be populated and used to render the chart
 */
function createChartData() {
  chartData = {
    labels: [],
    datasets: []
  };

  for (let i=0; i < statsData.length; i++) {
    let dataset = {
      label: statsData[i].toUpperCase(),
      fill: false,
      lineTension: 0.1,
      backgroundColor: statsBgColor[i],
      borderColor: statsColor[i],
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: statsColor[i],
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 2,
      pointHoverBackgroundColor: statsColor[i],
      pointHoverBorderColor: statsHoverColor[i],
      pointHoverBorderWidth: 1,
      pointRadius: 2,
      pointHitRadius: 10,
      data: []
    };
    chartData.datasets.push(dataset);
  }

  return chartData;
}

/**
 * Called every day to update the chart
 */
function updateStats() {
  statsLineChart.data.labels.push(world._daysOld);
  if (statsLineChart.data.labels.length == (limit+1))
    statsLineChart.data.labels.shift();
  for (let i=0; i < statsData.length; i++) {
    statsLineChart.data.datasets[i].data.push(world._actorMap.get(statsData[i]).length);
    if (statsLineChart.data.datasets[i].data.length == (limit+1))
      statsLineChart.data.datasets[i].data.shift();
  }

  statsLineChart.update();
}