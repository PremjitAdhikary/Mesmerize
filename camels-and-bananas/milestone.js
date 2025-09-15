class Milestone {

  constructor(x, y, km, directionRight) {
    this.x = x;
    this.y = y;
    this.km = km;
    this.bananas = 0;
    this.directionRight = directionRight;
    if (directionRight) {
        this.bananaTxtX = this.x - milestoneDiam/4;
        this.camelX = this.x + milestoneDiam/4;
    } else {
        this.bananaTxtX = this.x + milestoneDiam/4;
        this.camelX = this.x - milestoneDiam/4;
    }
    this.camelY = this.y+10;
  }

  draw() {
    noStroke();
    strokeWeight(1);
    fill(170);
    rect(this.x - milestoneDiam*0.3, this.y + 4 - milestoneDiam/2, milestoneDiam*0.6, milestoneDiam - 4);
    fill(0);
    rect(this.x - milestoneDiam*0.3, this.y + 4 - milestoneDiam/2, milestoneDiam*0.6, milestoneDiam*0.4);
    fill(255);
    stroke(255);
    let txtwd = textWidth(this.km);
    text(this.km, this.x-txtwd/2, this.y-4);
    if (this.bananas > 0) {
        stroke(0);
        fill(woodColor);
        rect(this.bananaTxtX-milestoneDiam/4, this.y, milestoneDiam/2, 20);
        fill(0);
        txtwd = textWidth(this.bananas);
        text(this.bananas, this.bananaTxtX-txtwd/2, this.y+15);
    }
  }

}