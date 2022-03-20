class TurtleEngine {

  constructor() {
    this.color = SketchColor.greenyellow().stringify();
    this.reset();
  }

  reset() {
    background(0);
    this.x = 0;
    this.y = 0;
    this.angle = -HALF_PI;
    this.drawEnabled = true;
    this.turtleEnabled = true;
  }

  render(ast) {
    push();
    translate(width/2, height/2);
    this.evaluateAndRender(ast);
    if (this.turtleEnabled) {
      this.renderTurtle()
    }
    pop();
  }

  evaluateAndRender(ast) {
    let currNode = ast;
    while (currNode != null) {
      TurtleEngine.OPS_MAP.get(currNode.command.type)(this, currNode);
      currNode = currNode.next;
    }
  }

  renderTurtle() {
    stroke(this.color);
    strokeWeight(1);
    fill(this.color);
    triangle(this.x-2.5, this.y+5, this.x+2.5, this.y+5, this.x, this.y-5);
  }

  moveTurtle(val) {
    if (this.drawEnabled) {
      stroke(this.color);
      strokeWeight(1);
      line(0, 0, 0, val);
    }
    translate(0, val);
  }

  setTurtlePosition(x, y) {
    pop();
    push();
    translate((width/2 + x), (height/2 + y));
    this.x = 0;
    this.y = 0;
  }

}

TurtleEngine.OPS_MAP = new Map([
  [TokenTypes.CLEAR_SCREEN, () => background(0)], 
  [TokenTypes.PEN_UP, me => me.drawEnabled = false], 
  [TokenTypes.PEN_DOWN, me => me.drawEnabled = true], 
  [TokenTypes.HOME, me => me.setTurtlePosition(0, 0)], 
  [TokenTypes.HIDE_TURTLE, me => me.turtleEnabled = false], 
  [TokenTypes.SHOW_TURTLE, me => me.turtleEnabled = true], 
  [TokenTypes.BACKWARD, (me, node) => me.moveTurtle(parseInt(node.op.val))], 
  [TokenTypes.FORWARD, (me, node) => me.moveTurtle(-parseInt(node.op.val))], 
  [TokenTypes.RIGHT, (me, node) => rotate(radians(parseInt(node.op.val)))], 
  [TokenTypes.LEFT, (me, node) => rotate(-radians(parseInt(node.op.val)))], 
  [TokenTypes.SET_XY, (me, node) => 
    me.setTurtlePosition(parseInt(node.firstOp.val), -(parseInt(node.secondOp.val)))], 
  [TokenTypes.REPEAT, (me, node) => {
    for (let i=0; i<parseInt(node.firstOp.val); i++) {
      me.evaluateAndRender(node.secondOp);
    }
  }]
]);