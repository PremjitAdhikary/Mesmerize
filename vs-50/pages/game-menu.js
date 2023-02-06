class GameMenu {

  constructor() {
    this.selectedDifficulty = 'easy';
    this.bwEnabled = false;
    this.audioEnabled = true;
    this.clickListeners = [];

    let greenButtonBGColor = SketchColor.blend(
      SketchColor.greenyellow(), SketchColor.greenyellow(), 
      SketchColor.grey(), SketchColor.grey()).stringify();
    let greenButtonHiLightBGColor = SketchColor.blend(
      SketchColor.greenyellow(), SketchColor.greenyellow(), 
      SketchColor.greenyellow(), SketchColor.grey()).stringify();
    let redButtonBGColor = SketchColor.blend(SketchColor.red(), SketchColor.red(), SketchColor.grey()).stringify();
    let redButtonHiLightBGColor = SketchColor.red().stringify();

    let generateGameButton = (x, y, txt) => 
      new GameButton({
        bgColor: SketchColor.white().stringify(), 
        hilightColor: (new SketchColor(245, 245, 245)).stringify(), 
        x, y, width: 100, height: 60, 
        txt, txtFont: fontSamarkan, txtSize: FONT_HEADING_SIZE, 
        txtColor: SketchColor.black().stringify()
      });

    let selectorButtonSize = 90;
    let generateSelectorButton = (x, y, bgColor, hilightBgColor, txt, buttonSize = selectorButtonSize) => 
      new GameButton({
        bgColor, hilightColor: (new SketchColor(245, 245, 245)).stringify(), hilightBgColor, 
        x, y, width: buttonSize, height: buttonSize/2, 
        txt, txtFont: fontSamarkan, txtSize: FONT_HEADING_SIZE, 
        txtColor: SketchColor.white().stringify()
      });

    this.storySelector = generateGameButton(width/6 - 50, 390, 'Story');
    this.storySelector.onClick = () => manager.showScene(GameStory);
    this.clickListeners.push(this.storySelector);

    this.controlsSelector = generateGameButton(width/2 - 50, 320, 'Controls');
    this.controlsSelector.onClick = () => manager.showScene(ControlsHelp);
    this.clickListeners.push(this.controlsSelector);

    this.trainSelector = generateGameButton(width/2 - 50, 390, 'Train');
    this.trainSelector.onClick = () => manager.showScene(Training);
    this.clickListeners.push(this.trainSelector);

    this.easySelector = generateSelectorButton(width/6*5 - selectorButtonSize - 60, 150, 
      greenButtonBGColor, 
      greenButtonHiLightBGColor, 'easy');
    this.clickListeners.push(this.easySelector);

    this.normalSelector = generateSelectorButton(width/6*5 - selectorButtonSize/2, 150, 
      SketchColor.blend(SketchColor.orange(), SketchColor.orange(), SketchColor.grey()).stringify(), 
      SketchColor.orange().stringify(), 'normal');
    this.clickListeners.push(this.normalSelector);

    this.hardSelector = generateSelectorButton(width/6*5 + 60, 150, 
      redButtonBGColor, 
      redButtonHiLightBGColor, 'hard');
    this.clickListeners.push(this.hardSelector);

    let selectDifficulty = (button, diff) => {
      this.selectedDifficulty = diff;
      this.easySelector.deselected();
      this.normalSelector.deselected();
      this.hardSelector.deselected();
      button.selected();
    };
    this.easySelector.onClick = () => selectDifficulty(this.easySelector, 'easy');
    this.easySelector.selected();
    this.normalSelector.onClick = () => selectDifficulty(this.normalSelector, 'normal');
    this.hardSelector.onClick = () => selectDifficulty(this.hardSelector, 'hard');

    // set up texts
    let txtLabelCalculator = txt => { return { txt, wd: textWidth(txt) }};
    textFont(fontSamarkan);
    textSize(FONT_HEADING_SIZE);
    this.difficultyLabel = txtLabelCalculator('Select Difficulty Level');
    textSize(FONT_NORMAL_SIZE);

    this.playSelector = generateGameButton(width/6*5 - 50, 320, 'Play');
    this.playSelector.onClick = () => manager.showScene(TheGame, { 
      difficulty: this.selectedDifficulty, bwEnabled: this.bwEnabled, audioEnabled: this.audioEnabled
    });
    this.clickListeners.push(this.playSelector);

    this.bwSelectorOn = generateSelectorButton(width/6*5, 410, 
      greenButtonBGColor, greenButtonHiLightBGColor, 
      'On', selectorButtonSize-30);
    this.bwSelectorOn.onClick = () => {
      this.bwEnabled = true;
      this.bwSelectorOff.deselected();
      this.bwSelectorOn.selected();
    };
    this.clickListeners.push(this.bwSelectorOn);

    this.bwSelectorOff = generateSelectorButton(width/6*5 + 65, 410, 
      redButtonBGColor, redButtonHiLightBGColor, 
      'Off', selectorButtonSize-30);
    this.bwSelectorOff.onClick = () => {
      this.bwEnabled = false;
      this.bwSelectorOn.deselected();
      this.bwSelectorOff.selected();
    };
    this.clickListeners.push(this.bwSelectorOff);
    this.bwSelectorOff.selected();

    this.audioSelectorOn = generateSelectorButton(width/6*5, 445, 
      greenButtonBGColor, greenButtonHiLightBGColor, 
      'On', selectorButtonSize-30);
    this.audioSelectorOn.onClick = () => {
      this.audioEnabled = true;
      this.audioSelectorOn.selected();
      this.audioSelectorOff.deselected();
    };
    this.clickListeners.push(this.audioSelectorOn);
    this.audioSelectorOn.selected();

    this.audioSelectorOff = generateSelectorButton(width/6*5 + 65, 445, 
      redButtonBGColor, redButtonHiLightBGColor, 
      'Off', selectorButtonSize-30);
    this.audioSelectorOff.onClick = () => {
      this.audioEnabled = false;
      this.audioSelectorOn.deselected();
      this.audioSelectorOff.selected();
    };
    this.clickListeners.push(this.audioSelectorOff);
  }

  draw() {
    this.drawBG();
    this.showTitle();
    this.drawButtons();
    this.drawDifficultySelect();
    this.drawSettingsSelect();
  }

  drawBG() {
    background(150);
    image(gameMenuImg, 0, 0);
  }

  showTitle() {
    stroke(255);
    fill(255);
    textFont(fontSamarkan);
    textSize(FONT_TITLE_SIZE);
    strokeWeight(0);
    text('Vs 50', 30, 80);
  }

  drawButtons() {
    this.storySelector.draw();
    this.controlsSelector.draw();
    this.trainSelector.draw();
    this.playSelector.draw();
  }

  drawDifficultySelect() {
    stroke(255);

    textFont(fontSamarkan);
    textSize(FONT_HEADING_SIZE);
    fill(255);
    strokeWeight(0);
    text(this.difficultyLabel.txt, width/6*5 - this.difficultyLabel.wd/2, 130);
    textSize(FONT_NORMAL_SIZE);
    let infoTxtX = width/6*5 - 110;
    let infoTxtY = 220;
    let percentageCalculator = 
      numMap => Math.ceil(numMap.get(this.selectedDifficulty)/numMap.get('normal')*100);
    text('Enemy life is at '+percentageCalculator(TheGame.NPC_LIFE_DIFFICULTY_MAPPER)+'%', 
      infoTxtX, infoTxtY);
    text('Enemy strength is at '+percentageCalculator(TheGame.NPC_STRENGTH_DIFFICULTY_MAPPER)+'%', 
      infoTxtX, infoTxtY+20);
    text('Enemy armor is at '+percentageCalculator(TheGame.NPC_ARMOR_DIFFICULTY_MAPPER)+'%', 
      infoTxtX, infoTxtY+40);

    this.easySelector.draw();
    this.normalSelector.draw();
    this.hardSelector.draw();
  }

  drawSettingsSelect() {
    this.bwSelectorOn.draw();
    this.bwSelectorOff.draw();
    this.audioSelectorOn.draw();
    this.audioSelectorOff.draw();

    textFont(fontSamarkan);
    textSize(FONT_NORMAL_SIZE);
    fill(255);
    strokeWeight(0);
    text('Noir graphics', width/6*5 - 120, 430);
    text('Game Audio', width/6*5 - 103, 465);
  }

  mouseClicked() {
    this.clickListeners.forEach( cl => cl.mouseClicked() );
  }
}