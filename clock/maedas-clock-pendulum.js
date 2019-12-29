class MaedasClockPendulum extends BaseClock {

  constructor() {
    super();

    let timeText = () => {
      let milli = floor(millis()%1000);
      let min = minute();
      let hr = hour()%12;
      let txt = 
        (hr<10 ? '0'+hr : hr) 
        + (milli > 500 ? ' : ' : '   ')
        + (min<10 ? '0'+min : min);
      return txt;
    };
    this._time = new PendulumClock(
      width/2, 0, height * 0.7, 30, timeText, this._hr_color);

    let periodText = () => hour() >= 12 ? 'PM' : 'AM';
    this._period = new PendulumClock(
      width/2, 0, height * 0.7, -30, periodText, this._millis_color);
  }

  show() {
    background(0);
    this._period.show();
    this._time.show();
  }

}

/**
 * Origin
 *   |\
 *   |θ\
 *  y|  \ l(length of pendulum)
 *   |   \
 *   |____\
 *     x  bob
 * 
 * In the above pendulum, let θ be the angle between y and l at the Origin. Then we have:
 * x = l sin θ
 * y = l cos θ
 * 
 * There are 2 forces on the bob. One is of gravity and the other is the pendulum force itself which 
 * gives the movement.
 * Since Force = mass x acceleration, we have...
 * Fg = m x g, where m = mass of the bob and g is gravitation
 * Fp = m x a, where a = angular acceleration of the bob
 * 
 * Another observation is that:
 * sin θ = Fp/Fg (check source for details)
 * => Fp = Fg x sin θ
 * => a = g x sin θ
 * 
 * Source: https://natureofcode.com/book/chapter-3-oscillation/#chapter03_section9
 */
class PendulumClock {

  constructor(originx, originy, length, startAngle, bobText, color) {
    this._origin = createVector(originx, originy);
    this._length = length;
    this._angle = startAngle;
    this.bobText = bobText;
    this._angularVelocity = 0;
    this._angularAcceleration = 0;
    this._color = color;
  }

  show() {
    this.updateVariables();
    this.drawBob();
  }

  updateVariables() {
    this._angularAcceleration = (-1 * PendulumClock.GRAVITY) * sin(this._angle);
    this._angle += this._angularVelocity;
    this._angularVelocity += this._angularAcceleration;
    this._angularVelocity *= PendulumClock.DAMPING;
  }

  drawBob() {
    let bob = createVector(this._origin.x, this._length);
    bob.x = this._length * sin(this._angle);
    bob.y = this._length * cos(this._angle);
    bob.add(this._origin);

    stroke(this._color);
    strokeWeight(1);
    fill(this._color);
    textSize(35);
    let bobText = this.bobText();
    let bobTextWidth = textWidth(bobText);

    push();
    translate(bob.x, bob.y);
    rotate(-this._angle);
    text(bobText, - bobTextWidth/2, 0);
    pop();
  }

}

PendulumClock.GRAVITY = 0.33;
PendulumClock.DAMPING = 0.9945;