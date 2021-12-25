class AirStrip {

  constructor() {
    this.baseColor = (new SketchColor(185, 185, 185)).stringify();
    this.segments = [];
    this.segments.push(new AirStripSegment(40, 405, 50, 30));
    this.segments.push(new AirStripSegment(90, 405, 50, 30));
    this.segments.push(new AirStripSegment(140, 405, 50, 30));
    this.segments.push(new AirStripSegment(190, 405, 50, 30));
    this.segments.push(new AirStripSegment(240, 405, 50, 30));
    this.segments.push(new AirStripSegment(290, 405, 50, 30));
    this.segments.push(new AirStripSegment(340, 405, 50, 30));
    this.segments.push(new AirStripSegment(390, 405, 50, 30));
    this.segments.push(new AirStripSegment(440, 405, 50, 30));
    this.segments.push(new AirStripSegment(490, 405, 50, 30));
    this.segments.push(new AirStripSegment(540, 405, 50, 30));
    this.segments.push(new AirStripSegment(590, 405, 50, 30));
    
    this.barWid = 100;
    this.barx = 20
    this.bary = 445;
  }

  init(showHealth = true) {
    this.segments.forEach( segment => segment.init() );
    this.showHealth = showHealth;
    this.state = OBJ_ON;
  }
  
  show() {
    drawPoly(
      [-30, 110, 250, 390, 530, 670, 670, 530, 390, 250, 110, -30], 
      [390, 390, 390, 390, 390, 390, 420, 420, 420, 420, 420, 420], 
      lineColor, 2, true, this.baseColor);
    this.segments.forEach( segment => segment.show() );
    if (debug) 
      this.segments.forEach( segment => segment.showCollisionBox() );
    this.drawHealthBar();
  }

  drawHealthBar() {
    if (!this.showHealth) return;
    stroke(darkColor);
    strokeWeight(1);
    noFill();
    rect (this.barx, this.bary, this.barWid, 5);
    let healthNow = map(AirStrip.MIN_HEALTH_PERCENTAGE, 0, 100, 0, this.barWid);
    line(this.barx+healthNow, this.bary-3, this.barx+healthNow, this.bary+8);
    fill(darkColor);
    let w = map(this.currHealth, 0, this.health, 0, this.barWid);
    rect(this.barx, this.bary, w, 5);
  }

  animate() {}

  isHit(x, y) {
    return this.segments.some(s => s.isHit(x, y));
  }

  damage(amount, x, y) {
    this.segments.find(s => s.isHit(x, y)).damage(amount);
    if (this.currHealth / this.health < (AirStrip.MIN_HEALTH_PERCENTAGE/100)) {
      this.state = OBJ_POP;
    }
  }

  repair(amount, x, y) {
    this.segments.find(s => s.isHit(x, y)).repair(amount);
  }

  get health() {
    return this.segments[0].health * this.segments.length
  }
  get currHealth() {
    return this.segments.map(s => s.currHealth).reduce( (a,b) => a+b, 0 );
  }

  repairStats() {
    return {
      total: this.segments.map(s => s.repaired).reduce( (a,b) => a+b, 0 ), 
      fullRepair: this.segments.map(s => s.fullRepaired).reduce( (a,b) => a+b, 0 )
    };
  }

}

AirStrip.MIN_HEALTH_PERCENTAGE = MIN_STRIP_HEALTH;

class AirStripSegment {

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    let g = 3;
    let o = 10;
    this.health = 60;
    this.scribXCords = [
      this.x - this.w/2 - o + g, this.x + this.w/2 - o - g, 
      this.x + this.w/2 + o - g, this.x - this.w/2 + o + g
    ];
    this.scribYCords = [this.y + this.h/2, this.y + this.h/2, this.y - this.h/2, this.y - this.h/2];
    this.init();
  }

  init() {
    this.currHealth = this.health;
    this.repaired = 0;
    this.fullRepaired = 0;
    this.cracks = [];
    this.cracksOffsetIndex = Math.floor(Math.random() * AirStripSegment.CRACKS_OFFSET.length);
  }

  show() {
    this.cracks.forEach( c => c.show() );
  }

  showCollisionBox() {
    stroke(255, 0, 0);
    strokeWeight(1);
    noFill();
    rect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
  }

  isHit(x, y) {
    return collidePointRect(x, y, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
  }

  damage(amount) {
    let tmp = this.currHealth;
    this.currHealth -= amount;
    this.currHealth = Math.max(0, this.currHealth);
    // damage segment
    let totalDamage = tmp - this.currHealth;
    if (totalDamage > 0)
      this.cracks.push(new SegmentCracks(totalDamage, 
        this.x + AirStripSegment.CRACKS_OFFSET[this.cracksOffsetIndex][0], 
        this.y + AirStripSegment.CRACKS_OFFSET[this.cracksOffsetIndex][1]));
    this.cracksOffsetIndex = (this.cracksOffsetIndex+1)%AirStripSegment.CRACKS_OFFSET.length;
  }

  repair(amount) {
    if (this.currHealth >= this.health) return;
    let tmp = this.currHealth;
    this.currHealth += amount;
    this.currHealth = Math.min(this.health, this.currHealth);
    this.repaired += (this.currHealth - tmp);
    if (this.currHealth == this.health)
    this.fullRepaired++;
    // repair cracks
    while (this.cracks.length > 1 && this.cracks[0].isRepaired()) this.cracks.shift();
    for (let i=0; i<this.cracks.length && amount > 0; i++) {
      amount = this.cracks[i].repair(amount);
    }
  }

}

AirStripSegment.CRACKS_OFFSET = [
  [-8, 0], [3, 3], [-2, 5], [0, 4], [7, 3], [4, 5]
];

class SegmentCracks {

  constructor(damage, x, y) {
    this.initialDamage = damage;
    this.currDamage = damage;
    this.r = map(damage, 0, 70, 5, 50);
    this.x = x;
    this.y = y;
    let index = Math.floor(Math.random() * SegmentCracks.MINOR_OFFSET.length);
    this.minors = [];
    for (let i=0; i<3; i++) {
      let j = (index+i) % SegmentCracks.MINOR_OFFSET.length;
      this.minors.push(
        createVector(SegmentCracks.MINOR_OFFSET[j][0], SegmentCracks.MINOR_OFFSET[j][1])
      );
    }
    this.active = true;
  }

  show() {
    let a = map(this.currDamage, 0, this.initialDamage, 0, 255);
    stroke(69, a);
    fill(99, a);
    strokeWeight(2);
    ellipse(this.x, this.y, this.r, 5);
    this.minors.forEach(m => ellipse(this.x+m.x, this.y+m.y, 3, 2));
  }

  repair(amount) {
    let tmp = this.currDamage;
    this.currDamage -= amount;
    this.currDamage = Math.max(0, this.currDamage);
    return (amount - (tmp - this.currDamage));
  }

  isRepaired = () => this.currDamage == 0;
}

SegmentCracks.MINOR_OFFSET = [
  [6, 2], [7, 3], [-6, -1], [-7, -2], [6, -3], [-7, 3], [-6, 3]
];