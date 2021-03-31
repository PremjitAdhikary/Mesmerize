class Help {

  constructor(color, callback) {
    this._textColor = color;
    this._callback = callback;
    this.setupCycle();
  }

  setupCycle() {
    let x = 50, y = 100;
    this.cycle = new LightCycle(1, createVector(x, y), 
      LightCycle.DIRECTION.NORTH, blue, this.grid, 2);
    this.cycle._path.push(createVector(x, y));
    this.cycle._path.push(createVector(x, y + 350));
    this._arrowColor = blue.copy().stringify();
  }

  show() {
    background(0);
    this.showPageText();
    this.showCycle();
    this.showHint();
  }

  showPageText() {
    noStroke();
    fill(this._textColor);
    textSize(24);
    textFont('Courier New');
    let heading = 'How to Play';
    let hWid = textWidth(heading);
    text(heading, width/2 - hWid/2, 40);
    
    textSize(18);
    text('The Light Cycle can turn either left or right.', 100, 80);
    text('It creates a jet wall along the path.', 100, 100);
    
    text('Your aim is to stay within the boundary and not', 100, 130);
    text('to hit any of the jet wall trails.', 100, 150);
    
    text('You are blue and your opponent orange.', 100, 180);
    text('Whoever crashes, loses!', 100, 200);

    text('Pro Tip: Try to force your opponent into a jet', 100, 260);
    text('wall trail by restricting space.', 100, 280);

    text('Customize the game by selecting the Game Mode', 100, 320);
    text('and Difficulty.', 100, 340);
  }
  
  showHint() {
    noStroke();
    fill(this._textColor);
    textSize(14);
    textFont('Courier New');
    let hint = 'Press Enter to return to Main Menu';
    let hWid = textWidth(hint);
    text(hint, width/2 - hWid/2, 460);
  }

  showCycle() {
    stroke(this._arrowColor);
    strokeWeight(4);
    line(this.cycle._current.x + 5, this.cycle._current.y - 30, 
      this.cycle._current.x + 5, this.cycle._current.y - 50);
    line(this.cycle._current.x + 25, this.cycle._current.y - 50, 
      this.cycle._current.x + 5, this.cycle._current.y - 50);
    triangle(this.cycle._current.x + 30, this.cycle._current.y - 50, 
      this.cycle._current.x + 25, this.cycle._current.y - 45, 
      this.cycle._current.x + 25, this.cycle._current.y - 55);     
    line(this.cycle._current.x - 5, this.cycle._current.y - 30, 
      this.cycle._current.x - 5, this.cycle._current.y - 50); 
    line(this.cycle._current.x - 25, this.cycle._current.y - 50, 
      this.cycle._current.x - 5, this.cycle._current.y - 50);
    triangle(this.cycle._current.x - 30, this.cycle._current.y - 50, 
      this.cycle._current.x - 25, this.cycle._current.y - 45, 
      this.cycle._current.x - 25, this.cycle._current.y - 55);    
    this.cycle.drawPath();
    this.cycle.drawCycle();
  }

  input(keyCode) {
    
    if (keyCode === ENTER) {
      this._callback();
      return;
    }
  }
}