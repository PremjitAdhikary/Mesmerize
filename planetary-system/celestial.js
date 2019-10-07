class CelestialBody {

  constructor(dist, radius, color, angleVelocity) {
    this._dist = dist;
    this._radius = radius;
    this._color = color;
    this._satellites;
    this._angle = random(-PI, PI);
    this._angleVelocity = angleVelocity;
  }

  show() {
    push(); // save the state (rotation/translation) of parent celestial

    rotate(this._angle); // first rotate and then translate out
    translate(this._dist, 0);
    this.drawSatellite();

    if (this._satellites) {
      for (let i=0; i<this._satellites.length; i++) {
        this._satellites[i].drawOrbit();
        this._satellites[i].show();
      }
    }

    pop(); // restore the state of parent celestial
    this._angle += this._angleVelocity;
  }

  drawSatellite() {
    fill(this._color);
    noStroke();
    circle(0, 0, this._radius * 2);
  }

  drawOrbit() {
    noFill();
    stroke(SketchColor.grey().alpha75().stringify());
    strokeWeight(1);
    circle(0, 0, this._dist * 2);
  }

  spawnSatellites(number, level) {
    this._satellites = [];
    for (let i=0; i<number; i++) {
      let rSatellite = 0;
      if (i == 0) {
        rSatellite = this._radius / 10;
      } else if (i < 3) {
        rSatellite = this._radius / random(7,8);
      } else {
        rSatellite =  this._radius / random(5,6);
      }
      let dSatellite = (i==0) ? this._radius + rSatellite * 2 
        : this._satellites[i-1]._dist + rSatellite * (4+i);
      
      let satellite = new CelestialBody(dSatellite, rSatellite, 
          this.celestialColor(level, i).stringify(), 
          CelestialBody.calculateAngularVelocity(this._angleVelocity));
      this._satellites.push(satellite);
      
      if (level > 0) {
        satellite.spawnSatellites(random(0, i+1), level - 1);
      }
    }
  }

  celestialColor(level, index) {
    if (level < 1)
      return SketchColor.white();
    let colors = [SketchColor.blend(SketchColor.grey(), SketchColor.grey(), SketchColor.yellow()), 
      SketchColor.blend(SketchColor.orange(), SketchColor.white()), 
      SketchColor.blend(SketchColor.blue(), SketchColor.green()), 
      SketchColor.red(), 
      SketchColor.blend(SketchColor.orange(), SketchColor.yellow())];
    return colors[index % colors.length];
  }

  addSatellite(satellite) {
    this._satellites.push(satellite);
  }

  static calculateAngularVelocity(parentAngleVelocity) {
    let x = (random(-1,1) > 0 ? 1 : -1);
    let angleVelocity = random(0.011, 0.013);

    // parentAngleVelocity needs to be subtracted so that rotation  
    // doesn't become cummulative with parents
    return angleVelocity * x - parentAngleVelocity;
  }
  
}