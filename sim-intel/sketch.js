let canvas;

let choice_region;
let choice_stat;

let regions;
let regionNames = ['State of Idiots', 'State of Mediocre', 'State of Gifted'];
let regionIqMean = [60, 95, 135];
let blue, pink, common;
let educationColors;
let jobColors;

let charts;

let yearCounter = 0;
let yearCountReset = 16;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  blue = (new SketchColor(152,222,217)).stringify();
  pink = (new SketchColor(248,161,209)).stringify();
  common = SketchColor.greenyellow().stringify();
  educationColors = [
    (new SketchColor(190,202,92)).stringify(),
    (new SketchColor(239,141,50)).stringify(),
    (new SketchColor(204,86,30)).stringify(),
    (new SketchColor(170,43,29)).stringify(),
    (new SketchColor(197,215,189)).stringify(),
    (new SketchColor(159,184,173)).stringify()
  ];
  jobColors = [
    (new SketchColor(255,238,147)).stringify(),
    (new SketchColor(190,202,92)).stringify(),
    (new SketchColor(239,141,50)).stringify(),
    (new SketchColor(170,43,29)).stringify()
  ];
  setupRegions();
}

function draw() {
  background(0);
  yearCounter++;
  let newYear = false;
  if (yearCounter > yearCountReset) {
    yearCounter = 0;
    newYear = true;
  }
  for(let reg of regions) {
    reg.show();
    if (newYear) {
      for (let person of reg._population) {
        person.ageUp();
      }
      reg.updateStats();
    }
  }
  yearCounter++;
  showStats();
}

function setupRegions() {
  if (choice_region == 1) {
    setupAllRegions(['State of All'], [55], [145], 620, 100, 5000);
  } else {
    let regionIqMin = regionIqMean.map(iq => iq-15);
    let regionIqMax = regionIqMean.map(iq => iq+15);
    setupAllRegions(regionNames, regionIqMin, regionIqMax, 200, 40, 2500);
  }
  setupCharts();
}

function setupAllRegions(namesOfRegions, iqMin, iqMax, w, initialPopulation, maxPopulation) {
  regions = [];
  for (let i=0; i<namesOfRegions.length; i++) {
    let reg = new Region(namesOfRegions[i], i*w + 10*(1+i), 10, maxPopulation, w, 200);
    for (let p=0; p<random(initialPopulation, initialPopulation + 20); p++) {
      let person = new Person(Math.round(random(iqMin[i], iqMax[i])), 1, reg);
      reg.addPerson(person);
    }
    regions.push(reg);
  }
}

function setupCharts() {
  charts = [];
  for (let region of regions) {
    let chart = {};
    chart.region = region;
    chart.populationBar = new SplitBar(region._w-10, 10, blue, pink);
    chart.ageWise = new MultiBarGraph(
      region._w-40, 100, 0, 200, ageWiseRange.map(awr => awr.txt), [blue, pink, common]);
    chart.iqBar = new SplitBar(region._w-30, 10, common, common);
    chart.iqWise = new MultiBarGraph(
      region._w-40, 100, 0, 200, iqWiseRange.map(iwr => iwr.txt), [common]);
    chart.educationBar = new SplitBar(region._w - 75, 10, common, 255);
    chart.educationPie = new PieChart(region._h - 50, 0, 100, educationColors, [blue, pink]);
    chart.jobBar = new SplitBar(region._w - 50, 10, common, 255);
    chart.jobPie = new PieChart(region._h - 50, 0, 100, jobColors, [blue, pink]);
    charts.push(chart);
  }
}

function showStats() {
  switch(choice_stat) {
    case 1: 
      showPopulationAgeDistribution();
      break;
    case 2: 
      showPopulationIqDistribution();
      break;
    case 3: 
      showPopulationEducation();
      break;
    case 4: 
      showPopulationJob();
      break;
  }
}

let ageWiseRange = [
  {l: 0, h: 10, txt: 'Kid'},
  {l: 11, h: 19, txt: 'Teen'},
  {l: 20, h: 30, txt: '20-30'},
  {l: 31, h: 45, txt: '31-45'},
  {l: 46, h: 65, txt: '46-65'},
  {l: 66, h: 100, txt: 'Senior'}
];
function showPopulationAgeDistribution() {
  for (let chart of charts) {
    let region = chart.region;
    push();
    translate(region._x, region._y + 210);
    showPopulation(chart);
    showAgeWise(chart);
    pop();
  }
  showLegends(['Male', 'Female', 'All'], [blue, pink, common], height - 25);
}

function showPopulation(chart) {
  let region = chart.region;
  let initY = 15;
  textSize(15);
  fill(255);
  text(region._name, 5, initY);
  let oneChildPolicy = region.oneChildPolicyEnabled() ? ' (1-child policy)' : '';
  textSize(12);
  text('Total Population: ' + region._population.length + oneChildPolicy, 5, initY + 25);
  chart.populationBar.updateVals(0, region._stats.malePopulation, region._stats.femalePopulation);
  chart.populationBar._x = 5;
  chart.populationBar._y = initY + 30;
  chart.populationBar.show();
}

function showAgeWise(chart) {
  let region = chart.region;
  let initY = 90;
  if (region._stats.age.male.range !== undefined) {
      textSize(12);
      text('Age Wise Distribution: (Ave: ' + Math.round(region._stats.age.overall.average) + ')', 
        5, initY);
    let maleCount = [];
    let femaleCount = [];
    let totalCount = [];
    for (let ageRange of ageWiseRange) {
      let mc = 0, fc = 0, tc = 0;
      for (let i=ageRange.l; i<=ageRange.h; i++) {
        mc += (region._stats.age.male.range[i]);
        fc += (region._stats.age.female.range[i]);
        tc += (region._stats.age.overall.range[i]);
      }
      maleCount.push(mc);
      femaleCount.push(fc);
      totalCount.push(tc);
    }
    chart.ageWise._x = 5;
    chart.ageWise._y = initY + 10;
    chart.ageWise.updateValues(maleCount, femaleCount, totalCount);
    chart.ageWise.updateMax(region._population.length);
    chart.ageWise.show();
  }
}

let iqWiseRange = [
  {l: 0, h: 49, txt: '< 50'},
  {l: 50, h: 85, txt: '< 85'},
  {l: 86, h: 115, txt: 'Ave'},
  {l: 116, h: 130, txt: '> 115'},
  {l: 131, h: 249, txt: '> 130'}
];
function showPopulationIqDistribution() {
  for (let chart of charts) {
    let region = chart.region;
    push();
    translate(region._x, region._y + 210);
    showIq(chart);
    showIqWise(chart);
    pop();
  }
}

function showIq(chart) {
  let region = chart.region;
  let initY = 15;
  textSize(15);
  fill(255);
  text(region._name, 5, initY);

  if (region._stats.iq.overall.highest !== undefined) {
    textSize(12);
    fill(255);
    text('IQ', 5, initY + 30);
    chart.iqBar.updateVals(region._stats.iq.overall.lowest, 
      Math.round(region._stats.iq.overall.average), 
      region._stats.iq.overall.highest-Math.round(region._stats.iq.overall.average));
    chart.iqBar._x = 25;
    chart.iqBar._y = initY + 20;
    chart.iqBar.show();
  }
}

function showIqWise(chart) {
  let region = chart.region;
  let initY = 90;
  if (region._stats.iq.overall.range !== undefined) {
      textSize(12);
      text('IQ Wise Distribution:', 5, initY);
    let totalCount = [];
    for (let iqRange of iqWiseRange) {
      let tc = 0;
      for (let i=iqRange.l; i<=iqRange.h; i++) {
        tc += (region._stats.iq.overall.range[i]);
      }
      totalCount.push(tc);
    }
    chart.iqWise._x = 5;
    chart.iqWise._y = initY + 10;
    chart.iqWise.updateValues(totalCount);
    chart.iqWise.updateMax(region._population.length);
    chart.iqWise.show();
  }
}

function showPopulationEducation() {
  for (let chart of charts) {
    let region = chart.region;
    push();
    translate(region._x, region._y + 210);
    let initY = 15;
    textSize(15);
    fill(255);
    text(region._name, 5, initY);

    let primaryValues = [];
    let secondaryValues = [];
    let educatedTotal = 0;
    for (let valueName of Region.EDUCATION_STATS) {
      primaryValues.push(region._stats.education.overall.get(valueName));
      educatedTotal += region._stats.education.overall.get(valueName);
      secondaryValues.push([
        region._stats.education.male.get(valueName),
        region._stats.education.female.get(valueName)
      ]);
    }

    textSize(12);
    fill(255);
    text('Education Statistics:', 5, initY + 20);
    text('Completed:', 5, initY + 35);
    chart.educationBar.updateVals(0, educatedTotal, 
      region._population.length - educatedTotal);
    chart.educationBar._x = 70;
    chart.educationBar._y = initY + 25;
    chart.educationBar.show();

    chart.educationPie._x = region._w/2 - region._h/3;
    chart.educationPie._y = initY + 50;
    chart.educationPie.updateValues(primaryValues, secondaryValues);
    chart.educationPie.updateMax(educatedTotal);
    chart.educationPie.show();

    pop();
  }

  let eduLabels = ['Secondary', 'Higher Secondary', 'Graduate', 'Post Graduate', 
    'Specialization', 'Post Specialization'];
  showLegends(eduLabels, educationColors, height - 25);
}

function showPopulationJob() {
  for (let chart of charts) {
    let region = chart.region;
    push();
    translate(region._x, region._y + 210);
    let initY = 15;
    textSize(15);
    fill(255);
    text(region._name, 5, initY);

    let primaryValues = [];
    let secondaryValues = [];
    let jobTotal = 0;
    for (let valueName of Region.JOB_STATS) {
      primaryValues.push(region._stats.job.overall.get(valueName));
      jobTotal += region._stats.job.overall.get(valueName);
      secondaryValues.push([
        region._stats.job.male.get(valueName),
        region._stats.job.female.get(valueName)
      ]);
    }

    textSize(12);
    fill(255);
    text('Job Statistics:', 5, initY + 20);
    text('In Job:', 5, initY + 35);
    chart.jobBar.updateVals(0, jobTotal, 
      region._population.length - jobTotal);
    chart.jobBar._x = 45;
    chart.jobBar._y = initY + 25;
    chart.jobBar.show();

    chart.jobPie._x = region._w/2 - region._h/3;
    chart.jobPie._y = initY + 50;
    chart.jobPie.updateValues(primaryValues, secondaryValues);
    chart.jobPie.updateMax(jobTotal);
    chart.jobPie.show();

    pop();
  }

  let jobLabels = ['Part Time', 'Full Time', 'Specialized', 'Research'];
  showLegends(jobLabels, jobColors, height - 25);
}

function showLegends(values, colors, y) {
  textSize(12);
  let legendWidth = 20;
  let gap = 5;
  let totalWidth = 0;
  for (let value of values) {
    totalWidth += textWidth(value);
    totalWidth += (legendWidth + 2* gap);
  }
  totalWidth -= gap;
  let startX = width/2 - totalWidth/2;
  for (let i=0; i<values.length; i++) {
    fill(colors[i]);
    rect(startX, y, legendWidth, legendWidth);
    startX += (legendWidth + gap);
    fill(255);
    text(values[i], startX, y + 15);
    startX += (textWidth(values[i]) + gap);
  }
}

function setBus(bus) {
  bus.register("ControlSIcr", e => {
    choice_region = e.detail.choice_region;
    setupRegions();
  });
  bus.register("ControlSIcs", e => {
    choice_stat = e.detail.choice_stat;
  });
}

function setData(d) {
  choice_region = d.choice_region;
  choice_stat = d.choice_stat;
}