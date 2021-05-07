class Help {

  constructor(color, callback) {
    this._textColor = color;
    this._callback = callback;
    this.setupCycles();
    this._pageNum = 0;
  }

  setupCycles() {
    this.setupCycleFirst();
    this.setupCycleSecond();
    this.setupCycleThird();
    this.setupCycleForth();
  }

  setupCycleFirst() {
    let x = 50, y = 100;
    let cycleFirst = new LightCycle(1, createVector(x, y), 
      LightCycle.DIRECTION.NORTH, blue, this.grid, 2);
    cycleFirst._path.push(createVector(x, y));
    cycleFirst._path.push(createVector(x, y + 350));
    this._arrowColorFirst = blue.copy().stringify();

    this.cyclesFirst = [];
    this.cyclesFirst.push(cycleFirst);
  }

  setupCycleSecond() {
    let x = 50, y = 80;
    let cycleSecondA = new LightCycle(1, createVector(x + 220, y), 
      LightCycle.DIRECTION.EAST, blue, this.grid, 2);
    cycleSecondA._path.push(createVector(x, y));
    cycleSecondA._path.push(createVector(x + 220, y));
    let cycleSecondB = new LightCycle(1, createVector(x + 320, y), 
      LightCycle.DIRECTION.WEST, orange, this.grid, 2);
    cycleSecondB._path.push(createVector(x + 530, y));
    cycleSecondB._path.push(createVector(x + 320, y));

    this.cyclesSecond = [];
    this.cyclesSecond.push(cycleSecondA);
    this.cyclesSecond.push(cycleSecondB);
  }

  setupCycleThird() {
    let x = 80, y = 80;
    let cycleThirdA = new PhaseCycle(1, createVector(x + 450, y + 100), 
      LightCycle.DIRECTION.EAST, this.grid, 2, 20);
    let pathA = [];
    pathA.push(createVector(x - 20, y + 300));
    pathA.push(createVector(x - 20, y));
    pathA.push(createVector(x - 60, y));
    pathA.push(createVector(x - 60, y + 100));
    pathA.push(createVector(x - 40, y + 100));
    cycleThirdA._paths.push(pathA);
    let pathB = [];
    pathB.push(createVector(x + 20, y + 100));
    pathB.push(createVector(x + 230, y + 100));
    cycleThirdA._paths.push(pathB);
    let pathC = [];
    pathC.push(createVector(x + 270, y + 100));
    pathC.push(createVector(x + 450, y + 100));
    cycleThirdA._paths.push(pathC);

    let cycleThirdB = new LightCycle(1, createVector(x, y + 300), 
      LightCycle.DIRECTION.SOUTH, orange, this.grid, 2);
    cycleThirdB._path.push(createVector(x, y));
    cycleThirdB._path.push(createVector(x, y + 300));
    
    let cycleThirdC = new LightCycle(1, createVector(x + 60, y + 120), 
      LightCycle.DIRECTION.WEST, orange, this.grid, 2);
    cycleThirdC._path.push(createVector(x + 500, y + 80));
    cycleThirdC._path.push(createVector(x + 250, y + 80));
    cycleThirdC._path.push(createVector(x + 250, y + 120));
    cycleThirdC._path.push(createVector(x + 60, y + 120));

    this.cyclesThird = [];
    this.cyclesThird.push(cycleThirdA);
    this.cyclesThird.push(cycleThirdB);
    this.cyclesThird.push(cycleThirdC);
  }

  setupCycleForth() {
    let x = 80, y = 80;
    let cycleForthA = new RinzlerCycle(1, createVector(x + 200, y + 170), 
      LightCycle.DIRECTION.EAST, this.grid, 2);
    cycleForthA._path.push(createVector(x, y + 300));
    cycleForthA._path.push(createVector(x, y));
    cycleForthA._path.push(createVector(x - 40, y));
    cycleForthA._path.push(createVector(x - 40, y + 170));
    cycleForthA._path.push(createVector(x + 200, y + 170));

    let cycleForthB = new SecondGenCycle(1, createVector(x + 50, y + 190), 
      LightCycle.DIRECTION.WEST, this.grid, 2);
    cycleForthB._path.push(createVector(x + 500, y + 150));
    cycleForthB._path.push(createVector(x + 250, y + 150));
    cycleForthB._path.push(createVector(x + 250, y + 190));
    cycleForthB._path.push(createVector(x + 50, y + 190));

    this.cyclesForth = [];
    this.cyclesForth.push(cycleForthA);
    this.cyclesForth.push(cycleForthB);
  }

  show() {
    background(0);
    switch(this._pageNum) {
      case 0: 
        this.showFirstPage();
        break;
      case 1: 
        this.showSecondPage();
        break;
      case 2: 
        this.showThirdPage();
        break;
      case 3: 
        this.showForthPage();
        break;
      case 4: 
        this.showFifthPage();
        break;
    }
    this.showHint();
  }

  showFirstPage() {
    this.showPageFirstText();
    this.showCycleFirst();
  }

  showSecondPage() {
    this.showPageSecondText();
    this.showCycles(this.cyclesSecond);
  }

  showThirdPage() {
    this.showPageThirdText();
    this.showCycles(this.cyclesThird);
  }

  showForthPage() {
    this.showPageForthText();
    this.showCycles(this.cyclesForth);
  }

  showFifthPage() {
    this.showPageFifthText();
  }

  showPageFirstText() {
    this.showHeading('How to Play');
    
    textSize(18);
    text('The Light Cycle can turn either left or right.', 100, 80);
    text('It creates a jet wall along the path.', 100, 100);
    
    text('Your aim is to stay within the boundary and not', 100, 130);
    text('to hit any of the jet wall trails.', 100, 150);

    text('Pro Tip: Try to force your opponent into a jet', 100, 260);
    text('wall trail by restricting space.', 100, 280);

    text('Customize the game by selecting the Game Mode,', 100, 320);
    text('the Game Difficulty, Control and Audio.', 100, 340);
  }

  showCycleFirst() {
    stroke(this._arrowColorFirst);
    strokeWeight(4);
    let cycle = this.cyclesFirst[0];
    line(cycle._current.x + 5, cycle._current.y - 30, 
      cycle._current.x + 5, cycle._current.y - 50);
    line(cycle._current.x + 25, cycle._current.y - 50, 
      cycle._current.x + 5, cycle._current.y - 50);
    triangle(cycle._current.x + 30, cycle._current.y - 50, 
      cycle._current.x + 25, cycle._current.y - 45, 
      cycle._current.x + 25, cycle._current.y - 55);     
    line(cycle._current.x - 5, cycle._current.y - 30, 
      cycle._current.x - 5, cycle._current.y - 50); 
    line(cycle._current.x - 25, cycle._current.y - 50, 
      cycle._current.x - 5, cycle._current.y - 50);
    triangle(cycle._current.x - 30, cycle._current.y - 50, 
      cycle._current.x - 25, cycle._current.y - 45, 
      cycle._current.x - 25, cycle._current.y - 55);   
    this.showCycles(this.cyclesFirst);
  }

  showPageSecondText() {
    this.showHeading('Game Mode: Vs One / Vs Many');
    
    textSize(18);
    text('You are blue and your opponent orange.', 100, 150);
    text('Whoever crashes, loses!', 100, 170);
    
    text('In Vs One, you will have a one on one', 100, 210);
    text('battle with an opponent.', 100, 230);
    
    text('In Vs Many, you will take on three', 100, 270);
    text('opponents at the same time.', 100, 290);
  }

  showPageThirdText() {
    this.showHeading('Game Mode: Phaser Cycle');

    textSize(18);
    text('Here you are up against five opponents.', 100, 100);
    text('You have Phaser Cycle to fight against them.', 100, 120);

    text('Phaser Cycle allows you to phase through', 100, 250);
    text('jet walls for a short duration.', 100, 270);

    text('Hold down X key to start phasing and release', 100, 300);
    text('it to stop phasing.', 100, 320);

    text('While phasing you don\'t create a jet wall.', 100, 350);
  }

  showPageForthText() {
    this.showHeading('Game Mode: Vs Rinzler');

    textSize(18);
    text('You have a one on one battle with Rinzler.', 100, 100);

    text('Rinzler Cycle can pass through it\'s own', 100, 130);
    text('jet wall.', 100, 150);

    text('Only way to defeat Rinzler is to force it to', 100, 180);
    text('crash in your jet wall.', 100, 200);

    text('To defeat Rinzler you will have the fastest', 100, 310);
    text('cycle - The Second Generation Light Cycle.', 100, 330);

    text('It is so fast that you need to slow it down', 100, 360);
    text('at times. Hold down X key to apply brakes.', 100, 380);
  }

  showPageFifthText() {
    this.showHeading('Game Controls');

    textSize(18);
    text('Top Down: Use the 4 arrow Keys to direct', 100, 100);
    text('the cycle. Think top down view and four', 100, 120);
    text('directions.', 100, 140);
    
    text('Rider: Use 2 arrow Keys (Left and Right)', 100, 180);
    text('to direct the cycle. This control mode', 100, 200);
    text('for cycle is far more challenging. Here', 100, 220);
    text('you are the rider and have to adjust', 100, 240);
    text('according to current direction the cycle', 100, 260);
    text('is riding.', 100, 280);
  }

  showHeading(heading) {
    stroke(this._textColor);
    strokeWeight(1);
    fill(this._textColor);
    textSize(24);
    textFont('Courier New');
    let hWid = textWidth(heading);
    text(heading, width/2 - hWid/2, 40);
  }

  showCycles(cycles) {
    for (let cycle of cycles) {
      cycle.drawPath();
      cycle.drawCycle();
    }
  }
  
  showHint() {
    stroke(this._textColor);
    strokeWeight(1);
    fill(this._textColor);
    textSize(14);
    textFont('Courier New');
    let instruction = 'Use Left and Right Arrow Keys to move through the help pages';
    let iWid = textWidth(instruction);
    text(instruction, width/2 - iWid/2, 440);
    let hint = 'Press Enter to return to Main Menu';
    let hWid = textWidth(hint);
    text(hint, width/2 - hWid/2, 460);
  }

  input(keyCode) {
    if (keyCode === ENTER) {
      this._callback();
      return;
    }
    if (keyCode === RIGHT_ARROW) {
      this._pageNum++;
      this._pageNum = Math.min(this._pageNum, 4);
      return;
    }
    if (keyCode === LEFT_ARROW) {
      this._pageNum--;
      this._pageNum = Math.max(this._pageNum, 0);
      return;
    }
  }

  inputOff(keyCode) { }
}