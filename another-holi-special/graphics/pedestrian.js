class Pedestrian extends GraphicObj {

  constructor(config) {
    super(config.sprite(), config.x, config.y, config.z);
    this.config = config;
    this.angle = 0.0;
    this.state = 'walk';
    this.isHit = false;
  }

  animate() {
    if (this.toRemove) return;
    if (this.isHit && this.state != 'angry') this.stateChanger();
    this.move();
    if (!this.config.isActive(this)) this.toRemove = true;
  }

  show() {
    if (this.toRemove) return;
    this.showPedestrian();
    if (this.isHit) 
      this.showPaint();
  }

  showPedestrian() {
    let cState = this.config[this.state];
    image(this.img.get(
      cState.spriteX, cState.spriteY, cState.spriteW, cState.spriteH), 
      this.x + cState.xOffset, this.y + cState.yOffset);
  }

  showPaint() {
    stroke(this.hitColor);
    fill(this.hitColor);
    let r = 20;
    let xOffset = this.config[this.state].paintXOffset;
    let yOffset = this.config[this.state].paintYOffset;
    let xMult = (this.state == 'angry' ? r/2 : r);
    let x = (this.x+this.hitPointX+xOffset);
    let y = (this.y+this.hitPointY+yOffset);
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let angle = (360 / this.points.length) * i;
      let px = cos(angle) * xMult * this.points[i] + x;
      let py = sin(angle) * r * this.points[i] + y;
      curveVertex(px, py);
    }
    endShape(CLOSE);
  }

  move() {
    let cState = this.config[this.state];
    this.x += cState.speed;
    this.y += (cState.bounce * sin(this.angle));
    this.angle += cState.angleIncr;
  }

  checkCollision(balloon) {
    if ((this.state != 'walk' || this.isHit) 
      || (balloon.z < this.z - 1 || balloon.z > this.z + 1)) return false;
    let bc = balloon.center();
    return collideRectCircle(
      (this.x + this.config.collide.x1), (this.y + this.config.collide.y1), 
      (this.config.collide.x2 - this.config.collide.x1), 
      (this.config.collide.y2 - this.config.collide.y1), 
      bc.x, bc.y, balloon.diameter());
  }

  hit(hitPoint, hitColor) {
    if (this.state != 'walk' || this.isHit) return;
    this.isHit = true;
    this.setupPaintBlob(hitPoint, hitColor);
    this.initStateChanger();
  }

  initStateChanger() {
    this.state = 'shout_1';
    this.states = ['shout_2', 'shout_1', 'shout_2', 'shout_1', 'shout_2', 
      'shout_1', 'shout_2', 'shout_1', 'shout_2', 'angry'];
    this.statesIndex = 0;
    let me = this;
    this.stateChanger = intervalCaller(() => 5, () => {
      me.state = me.states[me.statesIndex++];
      return true;
    });
  }

  setupPaintBlob(hitPoint, hitColor) {
    this.hitPointX = hitPoint.x - this.x;
    this.hitPointY = hitPoint.y - this.y;
    this.hitColor = hitColor.stringify();
    this.points = [];
    for (let i = 0; i < random(20, 35); i++) {
      this.points.push(random(0.65, 1.2));
    }
  }

}

Pedestrian.CONFIGURATIONS = [
  {
    x: 660, y: 110, z: -3, sprite: () => sprite, 
    collide: {
      x1: 50, y1: 95, x2: 90, y2: 175
    },
    walk: {
      spriteX: 660, spriteY: 0, spriteW: 125, spriteH: 260, 
      speed: -1.5, bounce: 0.3, angleIncr: 0.1, 
      xOffset: 0, yOffset: 0
    }, 
    shout_1: {
      spriteX: 790, spriteY: 0, spriteW: 155, spriteH: 260, 
      speed: 0, bounce: 0.1, angleIncr: 0.15, 
      xOffset: 0, yOffset: 0, 
      paintXOffset: 22, paintYOffset: 0
    }, 
    shout_2: {
      spriteX: 945, spriteY: 0, spriteW: 170, spriteH: 260, 
      speed: 0, bounce: 0.1, angleIncr: 0.15, 
      xOffset:-18, yOffset: 0, 
      paintXOffset: 22, paintYOffset: 0
    }, 
    angry: {
      spriteX: 1115, spriteY: 0, spriteW: 140, spriteH: 260, 
      speed: -2.5, bounce: 0.25, angleIncr: 0.12, 
      xOffset: 0, yOffset: 0, 
      paintXOffset: 0, paintYOffset: 0
    }, 
    isActive: pedestrian => pedestrian.x > -20
  }, 
  {
    x: 660, y: 110, z: -3, sprite: () => sprite, 
    collide: {
      x1: 50, y1: 155, x2: 130, y2: 200
    },
    walk: {
      spriteX: 650, spriteY: 260, spriteW: 175, spriteH: 300, 
      speed: -2.5, bounce: 0.3, angleIncr: 0.1, 
      xOffset: 0, yOffset: 0
    }, 
    shout_1: {
      spriteX: 825, spriteY: 260, spriteW: 220, spriteH: 300, 
      speed: 0, bounce: 0.1, angleIncr: 0.15, 
      xOffset: 0, yOffset: 0, 
      paintXOffset: 25, paintYOffset: 25
    }, 
    shout_2: {
      spriteX: 825, spriteY: 570, spriteW: 220, spriteH: 300, 
      speed: 0, bounce: 0.1, angleIncr: 0.15, 
      xOffset: -15, yOffset: -15, 
      paintXOffset: 25, paintYOffset: 25
    }, 
    angry: {
      spriteX: 650, spriteY: 570, spriteW: 175, spriteH: 300, 
      speed: -4.5, bounce: 0.25, angleIncr: 0.12, 
      xOffset: 0, yOffset: 0, 
      paintXOffset: -20, paintYOffset: 25 
    }, 
    isActive: pedestrian => pedestrian.x > -50
  }, 
  {
    x: 0, y: 110, z: -3, sprite: () => sprite, 
    collide: {
      x1: 50, y1: 95, x2: 90, y2: 175
    },
    walk: {
      spriteX: 1065, spriteY: 275, spriteW: 115, spriteH: 295, 
      speed: 2, bounce: 0.3, angleIncr: 0.1, 
      xOffset: 0, yOffset: 0
    }, 
    shout_1: {
      spriteX: 1075, spriteY: 585, spriteW: 157, spriteH: 290, 
      speed: 0, bounce: 0.1, angleIncr: 0.15, 
      xOffset: 0, yOffset: 0, 
      paintXOffset: 5, paintYOffset: 0
    }, 
    shout_2: {
      spriteX: 1232, spriteY: 585, spriteW: 157, spriteH: 290, 
      speed: 0, bounce: 0.1, angleIncr: 0.15, 
      xOffset:0, yOffset: 0, 
      paintXOffset: 5, paintYOffset: 0
    }, 
    angry: {
      spriteX: 1200, spriteY: 275, spriteW: 150, spriteH: 295, 
      speed: 4.5, bounce: 0.25, angleIncr: 0.12, 
      xOffset: 0, yOffset: 0, 
      paintXOffset: 0, paintYOffset: 0
    }, 
    isActive: pedestrian => pedestrian.x < 660
  }, 
  {
    x: 660, y: 110, z: -3, sprite: () => sprite_02, 
    collide: {
      x1: 65, y1: 135, x2: 130, y2: 200
    },
    walk: {
      spriteX: 0, spriteY: 0, spriteW: 152, spriteH: 325, 
      speed: -2, bounce: 0.3, angleIncr: 0.1, 
      xOffset: 0, yOffset: 0
    }, 
    shout_1: {
      spriteX: 318, spriteY: 0, spriteW: 410, spriteH: 325, 
      speed: 0, bounce: 0.1, angleIncr: 0.15, 
      xOffset: 0, yOffset: 0, 
      paintXOffset: 144, paintYOffset: 25
    },  
    shout_2: {
      spriteX: 732, spriteY: 0, spriteW: 466, spriteH: 325, 
      speed: 0, bounce: 0.1, angleIncr: 0.15, 
      xOffset: -32, yOffset: 0, 
      paintXOffset: 148, paintYOffset: 25
    }, 
    angry: {
      spriteX: 158, spriteY: 0, spriteW: 152, spriteH: 325, 
      speed: -3.5, bounce: 0.25, angleIncr: 0.12, 
      xOffset: 0, yOffset: 0, 
      paintXOffset: -20, paintYOffset: 25 
    }, 
    isActive: pedestrian => pedestrian.x > -50
  }
];

Pedestrian.GET_ONE = () => {
  let config = random(Pedestrian.CONFIGURATIONS);
  return new Pedestrian(config);
};