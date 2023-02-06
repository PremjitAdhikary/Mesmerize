class ControlsHelp {

  constructor() {
    this.backToMenuSelector = new GameButton({
      bgColor: SketchColor.white().stringify(), 
      hilightColor: (new SketchColor(245, 245, 245)).stringify(), 
      x: (width - 150), y: 390, width: 100, height: 60, 
      txt: 'Menu', txtFont: fontSamarkan, txtSize: FONT_HEADING_SIZE, 
      txtColor: SketchColor.black().stringify()
    }); 
    this.backToMenuSelector.onClick = () => manager.showScene(GameMenu);
    this.clickListeners = [];
    this.clickListeners.push(this.backToMenuSelector);
  }

  enter() {
    this.grass = [];
    for (let i = 0; i < ControlsHelp.FRAME_WD; i++) {
      this.grass.push(8 + random(-2, 2));
    }
    this.ramForwardAnim = new CharacterAnimator('ram', ramSpriteColored, ramJSON);
    this.ramForwardAnim.loadAnimationData(() => console.log('loaded ram for forward'));
    this.ramForwardAnim.set('forward', true);
    this.forwardFrame = 0;
    this.ramBackAnim = new CharacterAnimator('ram', ramSpriteColored, ramJSON);
    this.ramBackAnim.loadAnimationData(() => console.log('loaded ram for back'));
    this.ramBackAnim.set('back', true);
    this.backFrame = 0;

    this.ramPrimaryAnim = new CharacterAnimator('ram', ramSpriteColored, ramJSON);
    this.ramPrimaryAnim.loadAnimationData(() => console.log('loaded ram for primary'));
    this.clickPrimary = true;
    this.showPrimaryClick = false;
    let me = this;
    this.primaryActionEvent = intervalCaller(
      () => 30,
      () => {
        if (me.clickPrimary) {
          me.showPrimaryClick = true;
          me.clickPrimary = false;
          return true;
        }
        if (me.showPrimaryClick) {
          me.showPrimaryClick = false;
          me.ramPrimaryAnim.setWithCallback('action1', () => {
            me.ramPrimaryAnim.resetToDefault();
            me.clickPrimary = true;
          });
        }
        return false;
      }
    );
    
    this.ramSecondaryAnim = new CharacterAnimator('ram', ramSpriteColored, ramJSON);
    this.ramSecondaryAnim.loadAnimationData(() => console.log('loaded ram for secondary'));
    this.clickSecondary = true;
    this.showSecondaryClick = false;
    this.secondaryActionEvent = intervalCaller(
      () => 30,
      () => {
        if (me.clickSecondary) {
          me.showSecondaryClick = true;
          me.clickSecondary = false;
          return true;
        }
        if (me.showSecondaryClick) {
          me.showSecondaryClick = false;
          me.ramSecondaryAnim.setWithCallback('action2', () => {
            me.ramSecondaryAnim.resetToDefault();
            me.clickSecondary = true;
          });
        }
        return false;
      }
    );
  }

  draw() {
    background(100);
    this.drawForwardAnimation();
    this.drawDefendAnimation();
    this.drawPrimaryAnimation();
    this.drawSecondaryAnimation();
    this.drawInterfaceHelp();
    this.backToMenuSelector.draw();
  }

  drawForwardAnimation() {
    noStroke();
    fill(200);
    let forwardX = width/2 - ControlsHelp.FRAME_WD - 20;
    let forwardY = 10;
    rect(forwardX, forwardY, ControlsHelp.FRAME_WD, ControlsHelp.FRAME_HT);
    this.ramForwardAnim.animate();
    this.ramForwardAnim.show(forwardX + 160, forwardY + 50);
    image(actionsIconSprite.get(50, 100, 50, 50), forwardX + 300, forwardY + 60);
    this.drawGrass(forwardX, forwardY, this.forwardFrame, 0);
    this.forwardFrame += AllCharacters.RAM.speed;
    textFont(fontSamarkan);
    textSize(FONT_NORMAL_SIZE-2);
    fill(0);
    text('Hold down left mouse button', forwardX + 220, forwardY + 20);
    text('ahead to go forward', forwardX + 220, forwardY + 40);
  }

  drawDefendAnimation() {
    noStroke();
    fill(200);
    let backX = width/2 + 20;
    let backY = 10;
    rect(backX, backY, ControlsHelp.FRAME_WD, ControlsHelp.FRAME_HT);
    this.ramBackAnim.animate();
    this.ramBackAnim.show(backX + 160, backY + 50);
    image(actionsIconSprite.get(50, 100, 50, 50), backX + 20, backY + 60);
    this.drawGrass(backX, backY, this.backFrame, 0);
    this.backFrame -= AllCharacters.RAM.speed/2;
    textFont(fontSamarkan);
    textSize(FONT_NORMAL_SIZE-2);
    fill(0);
    text('Hold down left mouse button', backX + 220, backY + 20);
    text('behind to go back', backX + 220, backY + 40);
  }

  drawPrimaryAnimation() {
    this.primaryActionEvent();
    noStroke();
    fill(200);
    let primaryX = width/2 - ControlsHelp.FRAME_WD - 20;
    let primaryY = 170;
    rect(primaryX, primaryY, ControlsHelp.FRAME_WD, ControlsHelp.FRAME_HT+ControlsHelp.FRAME_HT_OFF);
    this.ramPrimaryAnim.animate();
    this.ramPrimaryAnim.show(primaryX + 120, primaryY + 50 + ControlsHelp.FRAME_HT_OFF);
    image(actionsIconSprite.get((this.showPrimaryClick ? 50 : 0), 100, 50, 50), primaryX + 300, 
      primaryY + 60 + ControlsHelp.FRAME_HT_OFF);
    this.drawGrass(primaryX, primaryY, 0, ControlsHelp.FRAME_HT_OFF);
    textFont(fontSamarkan);
    textSize(FONT_NORMAL_SIZE-2);
    fill(0);
    text('Left click anywhere to execute', primaryX + 190, primaryY + 20);
    text('Primary Attack', primaryX + 190, primaryY + 40);
  }

  drawSecondaryAnimation() {
    this.secondaryActionEvent();
    noStroke();
    fill(200);
    let secondaryX = width/2 + 20;
    let secondaryY = 170;
    rect(secondaryX, secondaryY, ControlsHelp.FRAME_WD, ControlsHelp.FRAME_HT+ControlsHelp.FRAME_HT_OFF);
    this.ramSecondaryAnim.animate();
    this.ramSecondaryAnim.show(secondaryX + 120, secondaryY + 50 + ControlsHelp.FRAME_HT_OFF);
    image(actionsIconSprite.get((this.showSecondaryClick ? 100 : 0), 100, 50, 50), secondaryX + 300, 
      secondaryY + 60 + ControlsHelp.FRAME_HT_OFF);
    this.drawGrass(secondaryX, secondaryY, 0, ControlsHelp.FRAME_HT_OFF);
    textFont(fontSamarkan);
    textSize(FONT_NORMAL_SIZE-2);
    fill(0);
    text('Right click anywhere to execute', secondaryX + 190, secondaryY + 20);
    text('Secondary Attack', secondaryX + 190, secondaryY + 40);
  }

  drawGrass(startX, startY, startFrame, offset) {
    noStroke();
    fill(230);
    beginShape();
    vertex(startX, startY + ControlsHelp.FRAME_HT*1.5 + offset);
    for (let i = 0; i < ControlsHelp.FRAME_WD; i++) {
      vertex(startX + i, 
        startY + ControlsHelp.FRAME_HT*1.5-20 
        + this.grass[Math.abs(i+startFrame+ControlsHelp.FRAME_WD)%ControlsHelp.FRAME_WD]
        + offset);
    }
    vertex(startX + ControlsHelp.FRAME_WD, startY + ControlsHelp.FRAME_HT*1.5 + offset);
    endShape();
  }

  drawInterfaceHelp() {
    let interfaceX = width/2 - ControlsHelp.FRAME_WD - 20;
    let interfaceY = 335;
    image(interfaceImg, interfaceX, interfaceY);
    let circledNumber = (num, x, y) => {
      let d = 20;
      fill(0);
      circle(x+d/2, y+d/2, d);
      fill(250);
      noStroke();
      text(num, x+d/2-textWidth(num)/2, y+15);
    };
    textFont(fontSamarkan);
    textSize(FONT_NORMAL_SIZE-2);
    circledNumber('1', interfaceX + 30, interfaceY + 40);
    circledNumber('2', interfaceX + 120, interfaceY + 55);
    circledNumber('3', interfaceX + 130, interfaceY + 100);
    let interfaceTxtX = width/2 - ControlsHelp.FRAME_WD + interfaceImg.width;
    text('Game information is available on the top left', interfaceTxtX, interfaceY + 35);
    text('1   Life indicator shows how much life Lord Ram has left', interfaceTxtX, interfaceY + 60);
    text('2   Abilities Icons show available abilities (active and passive)', interfaceTxtX, interfaceY + 85);
    text('3   Enemy countdown show how many enemies are left', interfaceTxtX, interfaceY + 110);
  }

  mouseClicked() {
    this.clickListeners.forEach( cl => cl.mouseClicked() );
  }

}

ControlsHelp.FRAME_WD = 450;
ControlsHelp.FRAME_HT = 90;
ControlsHelp.FRAME_HT_OFF = 15;