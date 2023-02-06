class BasicGameManager {

  constructor() {
    this.inactiveColor = SketchColor.black().alpha75().stringify();
    this.clickListeners = [];

    this.okToMenu = new GameButton({
      bgColor: SketchColor.white().stringify(), 
      hilightColor: (new SketchColor(245, 245, 245)).stringify(), 
      x: width/2 - 50, y: height/2, width: 100, height: 40, 
      txt: 'ok', txtFont: gameFont, txtSize: FONT_HEADING_SIZE, 
      txtColor: SketchColor.black().stringify()
    });
    this.okToMenu.onClick = () => {
      this.exitGame();
      manager.showScene(GameMenu);
    };
    this.clickListeners.push(this.okToMenu);

    this.cancelToGame = new GameButton({
      bgColor: SketchColor.white().stringify(), 
      hilightColor: (new SketchColor(245, 245, 245)).stringify(), 
      x: width/2 - 50, y: height/2 + 60, width: 100, height: 40, 
      txt: 'cancel', txtFont: gameFont, txtSize: FONT_HEADING_SIZE, 
      txtColor: SketchColor.black().stringify()
    });
    this.cancelToGame.onClick = () => this.disablePauseScreen();
    this.clickListeners.push(this.cancelToGame);

    this.okToInfoBanner = new GameButton({
      bgColor: SketchColor.white().stringify(), 
      hilightColor: (new SketchColor(245, 245, 245)).stringify(), 
      x: width/2 - 50, y: height/2, width: 100, height: 40, 
      txt: 'ok', txtFont: gameFont, txtSize: FONT_HEADING_SIZE, 
      txtColor: SketchColor.black().stringify()
    });
    this.okToInfoBanner.onClick = () => {
      if (this.infoBanner) {
        this.infoBanner.removeBanner();
      }
      this.okToInfoBanner.hide();
    };
    this.clickListeners.push(this.okToInfoBanner);

    this.showPauseBG = false;
   }

  setup() { 
    this.infoBGColor = SketchColor.black().alpha50().stringify();
    this.infoColor = SketchColor.white().stringify();
    this.loadingBarColor = SketchColor.greenyellow().stringify();
  }

  enter() { 
    this.gameId = Date.now();
    eventBus.updateGameId(this.gameId);
    this.idGenerator = idGenerator(1000, this.gameId);
    CharacterAnimator.GENERATED_FRAMES.clear(); // clear buffered graphics for characters
    let hero = this.buildHero();
    let npcs = this.buildNpcs(hero);
    hero.addNpcs(npcs);
    this.engine = new GameEngine({
      gameId: this.gameId, 
      infoBGColor: this.infoBGColor, 
      infoColor: this.infoColor, 
      loadingBarColor: this.loadingBarColor, 
      bgEnv: this.buildEnvironment(), 
      hero, 
      npcs, 
      npcAi: this.configureNpcAi(hero, npcs), 
      hint: this.getHint(), 
      mouseHandlerDelay: 20, 
      onMouseUp: () => eventBus.dispatch(hero.id, { action: CHAR_STOP } ), 
      onMouseDown: () => 
        eventBus.dispatch(hero.id, { 
          action: ( mouseX > GameCamera.OFFSET_X ? CHAR_FORWARD : CHAR_DEFEND )
        }), 
      onMouseLeftClick: () => {
        eventBus.dispatch(hero.id, { action: CHAR_STOP });
        eventBus.dispatch(hero.id, { action: CHAR_PRIMARY_ATTACK } )
      }, 
      onMouseRightClick: () => {
        eventBus.dispatch(hero.id, { action: CHAR_STOP });
        eventBus.dispatch(hero.id, { action: CHAR_SECONDARY_ATTACK } )
      }
    });
    this.infoBanner = undefined;
    eventBus.register(this.gameId, e => {
      if (e.detail.event == GAME_OVER_EVENT) {
        this.executeGameOver(e.detail);
      }
    });
    this.okToInfoBanner.hide();
    this.disablePauseScreen();
  }

  executeGameOver() {
    this.addInteractiveInfoBanner(
      'Game Over', ['Click on OK to go back to Main Menu'], 
      () => {
        this.exitGame();
        manager.showScene(GameMenu);
      }
    );
  }

  addInteractiveInfoBanner(title, lines, callbackOnBannerOut) {
    this.infoBanner = new InfoBanner(title, lines, gameFont);
    this.infoBanner.rectColor = this.inactiveColor;
    this.infoBanner.txtColor = 250;
    this.infoBanner.callOnBannerInPosition(() => this.okToInfoBanner.show());
    this.engine.pauseAnimation = true;
    this.infoBanner.callOnBannerOut(callbackOnBannerOut);
    this.okToInfoBanner.config.y = this.infoBanner.totalHeight + 60;
  }

  addNonInteractiveInfoBanner(title, lines, callbackOnBannerOut, frames) {
    this.infoBanner = new InfoBanner(title, lines, gameFont, frames);
    this.infoBanner.rectColor = this.inactiveColor;
    this.infoBanner.txtColor = 250;
    this.infoBanner.callOnBannerOut(callbackOnBannerOut);
  }

  enablePauseScreen() {
    this.okToMenu.show();
    this.cancelToGame.show();
    this.showPauseBG = true;
  }

  disablePauseScreen() {
    this.okToMenu.hide();
    this.cancelToGame.hide();
    this.showPauseBG = false;
  }

  exitGame() {
    eventBus.deregisterAll();
  }

  draw() { 
    this.engine.run();
    if (this.infoBanner) {
      this.infoBanner.animate();
      this.infoBanner.show();
    }
    this.showGameSpecificGraphics();
    this.showPauseScreen();
    this.okToInfoBanner.draw();
  }

  showPauseScreen() {
    if (!this.showPauseBG) return;
    noStroke();
    fill(this.inactiveColor);
    rect(0, 0, width, height);
    stroke(250);
    fill(250);
    strokeWeight(0);
    textFont(gameFont);
    textSize(FONT_HEADING_SIZE);
    let heading = 'Game Paused'
    text(heading, width/2 - textWidth(heading)/2, 100);
    textSize(FONT_NORMAL_SIZE);
    let firstLine = 'Do you wish to surrender this adventure?';
    text(firstLine, width/2 - textWidth(firstLine)/2, 150);
    let secondLine = 'Click OK to return to main menu';
    text(secondLine, width/2 - textWidth(secondLine)/2, 185);
    let thirdLine = 'Click Cancel to continue the game';
    text(thirdLine, width/2 - textWidth(thirdLine)/2, 210);
    this.okToMenu.draw();
    this.cancelToGame.draw();
  }

  mousePressed() {
    this.engine.mousePressed();
  }

  mouseReleased() {
    this.engine.mouseReleased();
  }

  mouseClicked() {
    this.clickListeners.forEach( cl => cl.mouseClicked() );
    this.engine.mouseClicked();
  }

  doubleClicked() {
    this.engine.doubleClicked();
  }

  keyPressed() {
    if (keyCode === ESCAPE && this.engine.gameLoaded) {
      this.enablePauseScreen();
    }
  }

}