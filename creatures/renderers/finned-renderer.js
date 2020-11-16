/**
 * Finned Renderer renders a body of curves and fins which swing around in accordance with 
 * the mover.
 * 
 * Constructor:
 * - len: The base length of the finned. The body tapers towards the tail with two point outs
 * 
 * Other Methods:
 * - render(mover): renders the finner based on the mover passed. Direction alignment is same 
 *     as the AxisRenderer. But the body movement is like a fish. The main body moves in 
 *     accordance to a sine wave.
 * 
 */
class FinnedRenderer {
  
  constructor(len) {
    this._len = len;
    this._strokeColor = 0;
    this._fillColor = 150;
    
    this._angle = 0;
    this._angleOffset = 0.2;
  }

  render(mover) {
    rectMode(CENTER);
    push();
    translate(mover._location.x, mover._location.y);
    rotate(mover._angle);
    this.renderBody();
    pop();

    if (mover.isMoving()) 
      this._angle += this._angleOffset;
  }

  /**
   * The Main Body is a curve to form the fish shape. The control points sway to sine wave
   */
  renderBody() {
    let len = this._len/2.4;
    let wid = len / 4;
    stroke(this._strokeColor);
    strokeWeight(3);
    fill(this._fillColor);

    let yOffset = map(sin(this._angle), -1, 1, -wid/3, wid/3);
    
    strokeWeight(1);
    
    // fins (like an arrow head)
    beginShape();
    vertex(wid*1.2,0);
    vertex(0, -wid - yOffset - wid/2);
    vertex(wid/2,0);
    vertex(0, wid - yOffset + wid/2);
    endShape(CLOSE);

    // main body - think of a curve drawn through f-g-d-b-a-c-e-h-f
    //         b              g
    //                d
    //  a                 f
    //                e
    //         c              h
    beginShape();
    vertex(-len*1.2, 0); // tail mid (f)
    vertex(-len*1.4, -wid/2 - yOffset);
    curveVertex(-len*1.4, -wid/2- yOffset); // tail tip (g)
    curveVertex(-len, -wid/2 + yOffset); // tail (d)
    curveVertex(0, -wid - yOffset); // body (b)
    curveVertex(len, 0); // tip (a)
    curveVertex(0, wid - yOffset); // body (c)
    curveVertex(-len, wid/2 + yOffset); // tail (e)
    curveVertex(-len*1.4, wid/2 - yOffset); // tail tip (h)
    vertex(-len*1.4, wid/2 - yOffset);
    endShape(CLOSE);

    strokeWeight(1);
  }

}