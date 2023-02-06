class GameStory {

  constructor() {
    textFont(fontSamarkan);
    textSize(FONT_NORMAL_SIZE);
    let configGenerator = (x, y, lines, renderer) => {
      return {
        x, y, lines, 
        boardHt: lines.length * FONT_NORMAL_HT + FONT_NORMAL_HT * 2, 
        boardWd: (lines.map(line => textWidth(line)).reduce((a,b) => Math.max(a,b), 0) + 20), 
        renderer
      };
    };
    this.storyPages = [
      configGenerator(600, 20, GameStory.INTRO, GameStory.INTRO_RENDER), 
      configGenerator(30, 300, GameStory.VALI, GameStory.VALI_RENDER), 
      configGenerator(30, 25, GameStory.CHALLENGE, GameStory.CHALLENGE_RENDER), 
      configGenerator(700, 15, GameStory.WEAPON, GameStory.WEAPON_RENDER), 
      configGenerator(340, 80, GameStory.OUTRO, GameStory.OUTRO_RENDER)
    ];
    this.currentPage = 0;
    this.clickListeners = [];
    this.boardColor = SketchColor.black().alpha(0.5).stringify();
    
    this.prevSelector = new GameButton({
      bgColor: SketchColor.white().stringify(), 
      hilightColor: (new SketchColor(245, 245, 245)).stringify(), 
      x: (width - 110), y: 310, width: 100, height: 40, 
      txt: 'Prev', txtFont: fontSamarkan, txtSize: FONT_HEADING_SIZE, 
      txtColor: SketchColor.black().stringify()
    });
    this.prevSelector.onClick = () => this.pageChange(this.currentPage-1);
    this.clickListeners.push(this.prevSelector);
    
    this.nextSelector = new GameButton({
      bgColor: SketchColor.white().stringify(), 
      hilightColor: (new SketchColor(245, 245, 245)).stringify(), 
      x: (width - 110), y: 360, width: 100, height: 40, 
      txt: 'Next', txtFont: fontSamarkan, txtSize: FONT_HEADING_SIZE, 
      txtColor: SketchColor.black().stringify()
    });
    this.nextSelector.onClick = () => this.pageChange(this.currentPage+1);
    this.clickListeners.push(this.nextSelector);

    this.backToMenuSelector = new GameButton({
      bgColor: SketchColor.white().stringify(), 
      hilightColor: (new SketchColor(245, 245, 245)).stringify(), 
      x: (width - 110), y: 430, width: 100, height: 40, 
      txt: 'Menu', txtFont: fontSamarkan, txtSize: FONT_HEADING_SIZE, 
      txtColor: SketchColor.black().stringify()
    });
    this.backToMenuSelector.onClick = () => manager.showScene(GameMenu);
    this.clickListeners.push(this.backToMenuSelector);
  }

  enter() {
    this.pageChange(0);
  }

  draw() {
    background(0);
    this.storyPages[this.currentPage].renderer();
    this.drawBoard(this.storyPages[this.currentPage]);
    this.prevSelector.draw();
    this.nextSelector.draw();
    this.backToMenuSelector.draw();
  }

  drawBoard(boardConfig) {
    noStroke();
    fill(this.boardColor);
    rect(boardConfig.x, boardConfig.y, boardConfig.boardWd, boardConfig.boardHt, 10);
    fill(255);
    strokeWeight(0);
    textFont(fontSamarkan);
    textSize(FONT_NORMAL_SIZE);
    let boardY = boardConfig.y + 15;
    boardConfig.lines.forEach(line => {
      boardY += FONT_NORMAL_HT;
      text(line, boardConfig.x + 10, boardY);
    });
  }

  pageChange(changeTo) {
    this.currentPage = changeTo;
    if (this.currentPage <= 0) {
      this.currentPage = 0;
    } else if (this.currentPage >= this.storyPages.length) {
      this.currentPage = this.storyPages.length-1;
    }
    if (this.storyPages.length <= 1) {
      this.prevSelector.hide();
      this.nextSelector.hide();
    } else if (this.currentPage == 0) {
      this.prevSelector.hide();
      this.nextSelector.show();
    } else if (this.currentPage == this.storyPages.length-1) {
      this.prevSelector.show();
      this.nextSelector.hide();
    } else {
      this.prevSelector.show();
      this.nextSelector.show();
    }
  }

  mouseClicked() {
    this.clickListeners.forEach( cl => cl.mouseClicked() );
  }

}

GameStory.INTRO = [
  'Kishkindha Forest!!  The Kingdom of the Vanaras!', 
  'Mighty Vali rules the Kishkindha Forest', 
  'Vali has banished his brother Sugreev from Kishkindha', 
  'Sugreev has asked Lord Ram for help to defeat Vali', 
  'This has brought Lord Ram to Kishkindha Forest!'
];

GameStory.INTRO_RENDER = () => {
  background(250);
  image(kishKindhaImg, 0, 0);
};

GameStory.VALI = [
  'Vali is a brave and extremely powerful warrior', 
  'Ready to take any challenger head-on', 
  'Legend has it that Lord Brahma granted him a boon', 
  'The boon has made Vali almost invincible!', 
];

GameStory.VALI_RENDER = () => {
  background(50);
  image(valiImg, 0, 0);
};

GameStory.CHALLENGE = [
  'Before Lord Ram challenges Vali', 
  'he has to defeat his loyal followers', 
  'His army of Vanara`s and Jambuvan`s !!!', 
  'Vanaras are nimble warriors', 
  'Jambuvans are feared warriors from bear clan'
];

GameStory.CHALLENGE_RENDER = () => {
  background(50);
  image(armyImg, 0, 0);
};

GameStory.WEAPON = [
  'Lord Ram wields the celestial bow `Sharanga`!', 
  'He draws in cosmic energy to power it!!', 
  'The energy transforms into bowstring', 
  'and any number of arrows the Lord wills!'
];

GameStory.WEAPON_RENDER = () => {
  background(20);
  image(lordRamImg, 0, 0);
};

GameStory.OUTRO = [
  'A grand Adventure awaits you!!', 
  'Play as Lord Ram in the forests of Kishkindha', 
  'Defeat Vali and his army of Vanaras and Jambuvans!'
];

GameStory.OUTRO_RENDER = () => {
  background(50);
  image(gamePlayImg, 0, 0);
};