class Person {
  
  constructor(iq, gen, region) {
    this._iq = iq;
    this._isMale = (random(100) > 50);
    this._age = 0;
    this._gen = gen;
    this._children = [];
    this._mother;
    this._father;
    this._spouse;
    this._siblingNum = 0;
    this._x = Math.round(random(region._w));
    this._y = Math.round(random(region._h));
    this._region = region;
    this._education = Person.EDUCATION.NA;
    this._educationOver = false;
    this._job = Person.JOB.JOB_LESS;
    this._jobOver = false;
    this._isDead = false;

    this._currDir = random(Person.DIRECTION);
    this._dirChangeCounter = 0;
    this._dirChangeReset = Math.round(random(10,25));
  }

  show() {
    if (this._isDead) return;
    stroke(this._isMale ? blue : pink);
    strokeWeight(3);
    point(this._x, this._y);
  }

  move() {
    let isYoung = () => this._age < 18;
    let hasALivingParent = () => ((this._father !== undefined && !this._father._isDead)
      || (this._mother !== undefined && !this._mother._isDead));
    if (isYoung() && hasALivingParent()) {
      let toFollow = !this._father._isDead ? this._father : this._mother;
      this._y = (toFollow._y + this._region._h + 3 * this._siblingNum) % this._region._h;
      this._x = toFollow._x;
      return;
    }

    let isMarried = () => this._spouse !== undefined && !this._spouse._isDead;
    if (!this._isMale && isMarried()) {
      this._x = (this._spouse._x + this._region._w + 3) % this._region._w;
      this._y = this._spouse._y;
      return;
    }

    if (this._dirChangeCounter > this._dirChangeReset) {
      this._dirChangeCounter = 0;
      this._currDir = random(Person.DIRECTION);
    }
    this._x = (this._x + this._region._w + this._currDir[0]*0.5) % this._region._w;
    this._y = (this._y + this._region._h + this._currDir[1]*0.5) % this._region._h;
    this._dirChangeCounter++;
  }

  ageUp() {
    let gotFatalSickness = () => this._age > 50 && random(100) < Math.min(40, 100 - this._age);
    let isTreatable = () => random(1) < this._region._stats.job.index;
    this._age++;
    if (this._age >= 100 || (gotFatalSickness() && !isTreatable())) {
      this._isDead = true;
      this._region.removePerson(this);
      return;
    }
    this.updateEducation();
    this.updateJob();
    this.updateFamily();
  }

  updateEducation() {
    for (let filter of educationEligibilityFilter) {
      if (filter.f(this)) {
        this._education = filter.r;
        break;
      }
    }
    if (!this._educationOver && educationOverFilter(this)) {
      this._educationOver = true;
      this._region.educationComplete(this);
    }
  }

  updateJob() {
    if (basicJobEligibility(this)) {
      for (let filter of jobEligibilityFilter) {
        if (filter.f(this)) {
          this._job = filter.r;
          this._region.gotAJob(this);
          break;
        }
      }
    }
    if (!this._jobOver && jobOverFilter(this)) {
      this._jobOver = true;
      this._region.retired(this);
    }
  }

  updateFamily() {
    let isReadyForMarraige = this._isMale && this._spouse === undefined && this._age > 21 
      && this._job != Person.JOB.JOB_LESS && random(100) < 20;
    if (isReadyForMarraige) {
      let suitableMatches = this._region._stats.singleFemales
        .filter(p => p._spouse === undefined && p._age > 18)
        .filter(p => this._father === undefined || !this._father._children.includes(p)) // skip sisters
        .filter(p => p._age >= this._age-10 && p._age <= this._age+10)
        .filter(p => p._iq >= this._iq-10 && p._iq <= this._iq+10)
      if (suitableMatches.length > 0) {
        this._spouse = random(suitableMatches);
        this._spouse._spouse = this;
      }
      return;
    }

    let isReadyForKid = this._isMale 
      && this._spouse !== undefined && !this._spouse._isDead && this._spouse._age < 45  
      && (this._children.length == 0 
        || (!this._region.oneChildPolicyEnabled() 
          && this._children[this._children.length-1]._age > this.calcKidGap())) 
      && random(100) < 30;
    if (isReadyForKid) {
      let kid = new Person(this.calcKidIq(), this._gen+1, this._region);
      this._region.addPerson(kid);
      this._children.push(kid);
      this._spouse._children.push(kid);
      kid._father = this;
      kid._mother = this._spouse;
      kid._siblingNum = this._children.length;
    }
  }

  calcKidGap() {
    return Math.round( (jobAndKidGap.get(this._job) + jobAndKidGap.get(this._spouse._job)) * 2/ 3 );
  }

  calcKidIq() {
    let rBase = random(100);
    let baseIq = rBase < 25 ? Math.max(this._iq, this._spouse._iq) : 
      rBase > 75 ? Math.min(this._iq, this._spouse._iq) : (this._iq + this._spouse._iq) / 2;
    let addIq = 0;
    if ((rBase < 25 || rBase > 75) && random(100) < 10) {
      addIq = rBase < 25 ? 3 : -3;
    }
    let kidIq = Math.round(baseIq + addIq);
    kidIq = Math.max(kidIq, 0);
    return kidIq;
  }
  
}


Person.DIRECTION = [
  [-1,-1], [0,-1], [1,-1],
  [-1,0],[1,0],
  [-1,1],[0,1],[1,1]
];

Person.EDUCATION = {};
Person.EDUCATION.NA = 'NA';
Person.EDUCATION.PRIMARY = 'P';
Person.EDUCATION.SECONDARY = 'S';
Person.EDUCATION.HIGHER_SECONDARY = 'HS';
Person.EDUCATION.GRADUATE = 'UG';
Person.EDUCATION.POST_GRADUATE = 'PG';
Person.EDUCATION.SPECIALIZATION = 'UGS';
Person.EDUCATION.POST_SPECIALIZATION = 'PGS';

// education filters
let eligibleForPrimaryEducation = p => p._education === Person.EDUCATION.NA && p._age >= 5;
let eligibleForSecondaryEducation = p => p._education === Person.EDUCATION.PRIMARY && p._age >= 10;
let eligibleForHigherSecondaryEducation = 
  p => p._education === Person.EDUCATION.SECONDARY && p._age >= 16 && p._iq >= 65;
let eligibleForGraduateEducation = 
  p => p._education === Person.EDUCATION.HIGHER_SECONDARY && p._age >= 18 && p._iq >= 90;
let eligibleForPostGraduateEducation = 
  p => p._education === Person.EDUCATION.GRADUATE && p._age >= 21 && p._iq >= 110;
let eligibleForSpecializedEducation = 
  p => p._education === Person.EDUCATION.HIGHER_SECONDARY && p._age >= 18 && p._iq >= 125;
let eligibleForPostSpecializedEducation = 
  p => p._education === Person.EDUCATION.SPECIALIZATION && p._age >= 22 && p._iq >= 135;
let educationEligibilityFilter = [
  {f: eligibleForPrimaryEducation, r: Person.EDUCATION.PRIMARY},
  {f: eligibleForSecondaryEducation, r: Person.EDUCATION.SECONDARY},
  {f: eligibleForHigherSecondaryEducation, r: Person.EDUCATION.HIGHER_SECONDARY},
  {f: eligibleForSpecializedEducation, r: Person.EDUCATION.SPECIALIZATION},
  {f: eligibleForGraduateEducation, r: Person.EDUCATION.GRADUATE},
  {f: eligibleForPostSpecializedEducation, r: Person.EDUCATION.POST_SPECIALIZATION},
  {f: eligibleForPostGraduateEducation, r: Person.EDUCATION.POST_GRADUATE}
];
let educationOverFilter = 
  p => 
    (p._education === Person.EDUCATION.SECONDARY && p._age > 16)
    || (p._education === Person.EDUCATION.HIGHER_SECONDARY && p._age > 18)
    || (p._education === Person.EDUCATION.GRADUATE && p._age > 21)
    || (p._education === Person.EDUCATION.POST_GRADUATE && p._age > 24)
    || (p._education === Person.EDUCATION.SPECIALIZATION && p._age > 22)
    || (p._education === Person.EDUCATION.POST_SPECIALIZATION && p._age > 26);

Person.JOB = {};
Person.JOB.JOB_LESS = 'JL';
Person.JOB.PART_TIME = 'PT';
Person.JOB.NORMAL = 'J';
Person.JOB.SPECIAL = 'SJ';
Person.JOB.RESEARCH = 'R';

// gaps by jobs
let jobAndKidGap = new Map();
jobAndKidGap.set(Person.JOB.JOB_LESS, 1);
jobAndKidGap.set(Person.JOB.PART_TIME, 1);
jobAndKidGap.set(Person.JOB.NORMAL, 2);
jobAndKidGap.set(Person.JOB.SPECIAL, 3);
jobAndKidGap.set(Person.JOB.RESEARCH, 5);

// job filters
let basicJobEligibility = p => !p._jobOver && p._educationOver && p._job === Person.JOB.JOB_LESS;
let eligibleForPartTime = p => p._age >= 16;
let eligibleForNormalJob = p => 
  [Person.EDUCATION.GRADUATE, Person.EDUCATION.POST_GRADUATE].includes(p._education) 
  && p._age >= 21;
let eligibleForSpecializedJob = p => 
  [Person.EDUCATION.SPECIALIZATION, Person.EDUCATION.POST_GRADUATE].includes(p._education) 
  && p._age >= 21 && p._iq >= 120;
let eligibleForResearch = p => 
  p._education === Person.EDUCATION.POST_SPECIALIZATION && p._age >= 26;
let jobEligibilityFilter = [
  {f: eligibleForResearch, r: Person.JOB.RESEARCH},
  {f: eligibleForSpecializedJob, r: Person.JOB.SPECIAL},
  {f: eligibleForNormalJob, r: Person.JOB.NORMAL},
  {f: eligibleForPartTime, r: Person.JOB.PART_TIME}
];
let jobOverFilter = p => p._age > 65;