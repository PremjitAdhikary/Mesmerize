class Settings extends BaseMenu {

  setup() {
    this.activeItem = 0;
    this.mainMenu.push(
      new MenuItem('Speed: ' + this.getSpeed(), true, 
      () => {
        speed = speed == NORMAL ? FAST : NORMAL;
        this.mainMenu[0].name = 'Speed: ' + this.getSpeed();
      })
    );
    this.mainMenu.push(
      new MenuItem('Graphics: ' + this.getGraphics().name, false, 
      () => {
        graphics = this.getGraphics().next;
        this.mainMenu[1].name = 'Graphics: ' + this.getGraphics().name;
      })
    );
    this.mainMenu.push(
      new MenuItem('Audio: ' + this.getAudio().name, false, 
      () => {
        this.getAudio().nextState();
        this.mainMenu[2].name = 'Audio: ' + this.getAudio().name;
      })
    );
    this.mainMenu.push(
      new MenuItem('Back to Main Menu', false, 
      () => {
        manager.showScene(Menu);
      })
    );
    this.drawIconFunctions = [
      this.drawSpeedIcon, this.drawGraphicsIcon, this.drawAudioIcon, this.drawMainMenuIcon];
  }

  getGraphics = () => Settings.GRAPHICS_LIST.find( gi => gi.item == graphics );

  getAudio = () => Settings.AUDIO_LIST.find( ai => ai.currState() );

  getSpeed = () => speed == NORMAL ? 'Normal' : 'Fast';

  draw() {
    background(bgColor);
    super.draw();
    this.drawIconFunctions[this.activeItem]();
  }

  drawSpeedIcon() {
    let xSpeed = [-40, -20, -40, -30, -10, -30];
    let ySpeed = [120, 160, 200, 200, 160, 120]
    stroke(lineColor);
    fill(lineColor);
    strokeWeight(1);
    beginShape();
    for (let i=0; i<6; i++) {
      vertex(width/2 + xSpeed[i], ySpeed[i]);
    }
    endShape();
    if (speed == FAST) {
      beginShape();
      for (let i=0; i<6; i++) {
        vertex(width/2 + xSpeed[i] + 30, ySpeed[i]);
      }
      endShape();
      beginShape();
      for (let i=0; i<6; i++) {
        vertex(width/2 + xSpeed[i] + 60, ySpeed[i]);
      }
      endShape();
    }
  }

  drawGraphicsIcon() {
    let xCords = [-50, 50, 50,-50];
    let yCords = [-50,-50, 50, 50];
    push();
    translate(width/2, 170);
    if (graphics == BASIC) {
      drawBasicPoly(xCords, yCords, blueColor, 4, true, blueColor, true, blueColor);
    } else if (graphics == SCRIBBLE) {
      drawScribblePoly(xCords, yCords, blueColor, 4, 
        true, bgColor, true, xCords, yCords, 
        blueColor, 1, 5, -40);
    } else if (graphics == OUTLINE) {
      drawScribblePoly(xCords, yCords, blueColor, 4, true, bgColor, false);
    }
    pop();
  }

  drawAudioIcon() {
    stroke(lineColor);
    strokeWeight(1);
    fill(lineColor);
    rect(width/2 - 20, 130, 20, 8);
    rect(width/2 - 4, 130, 8, 70);
    circle(width/2 - 12, 200, 32);
    if (!audioOn && !bgSoundOn) {
      stroke(255,0,0);
      fill(255,0,0);
      push();
      translate(width/2-40, 200);
      rotate(-HALF_PI/2);
      rect(0, 0, 80, 8);
      pop();
    }
  }

  drawMainMenuIcon() {
    stroke(lineColor);
    strokeWeight(1);
    fill(lineColor);
    rect(width/2 - 50, 120, 100, 8);
    rect(width/2 - 50, 150, 100, 8);
    rect(width/2 - 50, 180, 100, 8);
  }

}

Settings.GRAPHICS_LIST = [
  { item: BASIC, name: 'Blocks', next: OUTLINE },
  { item: OUTLINE, name: 'Pencil', next: SCRIBBLE },
  { item: SCRIBBLE, name: 'Sketch', next: BASIC }
];

Settings.AUDIO_LIST = [
  { name: 'All On', currState: () => audioOn && bgSoundOn, nextState: () => {
    audioOn = false;
    bgSoundOn = false;
  } }, 
  { name: 'All Off', currState: () => !audioOn && !bgSoundOn, nextState: () => {
    audioOn = true;
    bgSoundOn = false;
  } }, 
  { name: 'Only Action Sound', currState: () => audioOn && !bgSoundOn, nextState: () => {
    audioOn = false;
    bgSoundOn = true;
  } }, 
  { name: 'Only Background Sound', currState: () => !audioOn && bgSoundOn, nextState: () => {
    audioOn = true;
    bgSoundOn = true;
  } }
];