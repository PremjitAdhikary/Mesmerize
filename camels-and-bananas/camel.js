class Camel {
  constructor(pos, max) {
    this.position = pos;
    this.max = max;
    this.bananas = 0;
  }

  eat() {
    if (this.bananas <= 0) throw('no bananas to eat');
    this.bananas--;
  }

  pickUpMax() {
    let stone = this.position == -1 ? routeStart : theRoute[this.position];
    if (stone.bananas == 0) return false;
    if (stone.bananas + this.bananas > this.max) {
      stone.bananas -= (this.max - this.bananas);
      this.bananas = this.max;
      return true;
    }
    this.bananas += stone.bananas;
    stone.bananas = 0;
    return true;
  }

  pickUp(bananas) {
    let stone = this.position == -1 ? routeStart : theRoute[this.position];
    if (stone.bananas == 0) return false;
    if (this.bananas + bananas > this.max) {
      stone.bananas -= (this.max - bananas);
      this.bananas = bananas;
      return true;
    }
    this.bananas += bananas;
    stone.bananas -= bananas;
    return true;
}

  pickOneAndEat() {
    let stone = this.position == -1 ? routeStart : theRoute[this.position];
    stone.bananas--;
  }

  drop() {
    let stone = this.position == -1 ? routeStart : theRoute[this.position];
    stone.bananas += this.bananas;
    this.bananas = 0;
  }

  draw() {
    let stone;
    if (this.position == -1) stone = routeStart; 
    else if (this.position == routeLength) stone = theRoute[routeLength-1]; 
    else stone = theRoute[this.position];
    stroke(255);
    strokeWeight(1);
    fill(camelColor);
    circle(stone.camelX, stone.camelY, milestoneDiam*0.6);
    fill(255)
    let txtwd = textWidth(this.bananas);
    text(this.bananas, stone.camelX-txtwd/2, stone.camelY+3);
  }
}