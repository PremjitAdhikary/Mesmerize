class Region {

  constructor(name, x, y, maxPop, w, h) {
    this._name = name;
    this._x = x;
    this._y = y;
    this._h = h;
    this._w = w;
    this._population = [];
    this._maxPop = maxPop;
    
    this.initializeStats();
  }

  show() {
    push();
    translate(this._x, this._y);
    stroke(255);
    strokeWeight(1);
    noFill();
    rect(0, 0, this._w, this._h);
    for (let person of this._population) {
      person.move();
      person.show();
    }
    pop();
  }

  addPerson(person) {
    this._population.push(person);

    this._stats.iq.overall.range[person._iq]++;
    if (person._isMale) {
      this._stats.iq.male.range[person._iq]++;
    } else {
      this._stats.iq.female.range[person._iq]++;
    }
  }

  removePerson(person) {
    let indexInPopulation = this._population.indexOf(person);
    this._population.splice(indexInPopulation, 1);

    this._stats.iq.overall.range[person._iq]--;
    if (person._isMale) {
      this._stats.iq.male.range[person._iq]--;
    } else {
      this._stats.iq.female.range[person._iq]--;
    }
    
    if (person._educationOver) {
      this.updateAnEducation(person, false);
    }
    if (person._jobOver) {
      this._stats.job.retired--;
    } else {
      if (this._stats.job.overall.has(person._job)) {
        this.updateAJob(person, false);
      }
    }
  }

  educationComplete(person) {
    this.updateAnEducation(person, true);
  }

  updateAnEducation(person, increase) {
    let c = increase ? 1 : -1;
    this._stats.education.overall.set(
      person._education, this._stats.education.overall.get(person._education) + c);
    if (person._isMale) {
      this._stats.education.male.set(
        person._education, this._stats.education.male.get(person._education) + c);
    } else  {
      this._stats.education.female.set(
        person._education, this._stats.education.female.get(person._education) + c);
    }
  }

  gotAJob(person) {
    this.updateAJob(person, true);
  }

  retired(person) {
    this.updateAJob(person, false);
    this._stats.job.retired++;
  }

  updateAJob(person, increase) {
    let c = increase ? 1 : -1;
    this._stats.job.overall.set(
      person._job, this._stats.job.overall.get(person._job) + c);
    if (person._isMale) {
      this._stats.job.male.set(
        person._job, this._stats.job.male.get(person._job) + c);
    } else  {
      this._stats.job.female.set(
        person._job, this._stats.job.female.get(person._job) + c);
    }
    this._stats.job.index = 
      ((this._stats.job.overall.get(Person.JOB.RESEARCH) * 3
        + this._stats.job.overall.get(Person.JOB.SPECIAL)) 
        / this._population.length);
  }

  oneChildPolicyEnabled() {
    return this._population.length > this._maxPop;
  }

  initializeStats() {
    this._stats = {};

    this._stats.age = {};
    this._stats.age.overall = {};
    this._stats.age.male = {};
    this._stats.age.female = {};

    this._stats.iq = {};
    this._stats.iq.overall = {};
    this._stats.iq.overall.range = new Array(250).fill(0);
    this._stats.iq.male = {};
    this._stats.iq.male.range = new Array(250).fill(0);
    this._stats.iq.female = {};
    this._stats.iq.female.range = new Array(250).fill(0);

    this._stats.education = {};
    for (let n of ['overall', 'male', 'female']) {
      this._stats.education[n] = new Map();
      for (let e of Region.EDUCATION_STATS) {
        this._stats.education[n].set(e, 0);
      }
    }

    this._stats.job = {};
    for (let n of ['overall', 'male', 'female']) {
      this._stats.job[n] = new Map();
      for (let e of Region.JOB_STATS) {
        this._stats.job[n].set(e, 0);
      }
    }
    this._stats.job.retired = 0;
  }

  updateStats() {
    let allMales = this._population.filter(p => p._isMale && !p._isDead);
    let allFemales = this._population.filter(p => !p._isMale && !p._isDead);
    
    this._stats.malePopulation = allMales.length;
    this._stats.femalePopulation = allFemales.length;

    this.updateAgeStats(allMales, allFemales);
    this.updateIqStats(allMales, allFemales);

    this._stats.singleFemales = allFemales
      .filter(p => p._spouse === undefined && p._age > 18);
  }

  updateAgeStats(allMales, allFemales) {
    this._stats.age.overall.range = new Array(101).fill(0);
    this._population.forEach(p => this._stats.age.overall.range[p._age]++);
    this._stats.age.overall.average = this.calcAverage(this._population, (a,b) => a+b._age);

    this._stats.age.male.range = new Array(101).fill(0);
    allMales.forEach(p => this._stats.age.male.range[p._age]++);
    this._stats.age.male.average = this.calcAverage(allMales, (a,b) => a+b._age);
    
    this._stats.age.female.range = new Array(101).fill(0);
    allFemales.forEach(p => this._stats.age.female.range[p._age]++);
    this._stats.age.female.average = this.calcAverage(allFemales, (a,b) => a+b._age);
  }

  updateIqStats(allMales, allFemales) {
    this.calcIqFor(this._stats.iq.overall, this._population);
    this.calcIqFor(this._stats.iq.male, allMales);
    this.calcIqFor(this._stats.iq.female, allFemales);
  }

  calcIqFor(iqResult, dataArray) {
    iqResult.average = this.calcAverage(dataArray, (a,b) => a+b._iq);
    iqResult.lowest = dataArray.length == 0 ? 0 : 
      dataArray.reduce((a,b) => Math.min(a,b._iq), 1000);
    iqResult.highest = dataArray.length == 0 ? 0 : 
      dataArray.reduce((a,b) => Math.max(a,b._iq), 0);
  }

  calcAverage(dataArray, reducer) {
    return dataArray.length == 0 ? 0 : dataArray.reduce(reducer, 0) / dataArray.length;
  }
}

Region.EDUCATION_STATS = [
  Person.EDUCATION.SECONDARY, Person.EDUCATION.HIGHER_SECONDARY, 
  Person.EDUCATION.GRADUATE, Person.EDUCATION.POST_GRADUATE, 
  Person.EDUCATION.SPECIALIZATION, Person.EDUCATION.POST_SPECIALIZATION
];
Region.JOB_STATS = [
  Person.JOB.PART_TIME, Person.JOB.NORMAL, Person.JOB.SPECIAL, Person.JOB.RESEARCH
];