/**
 * The heart
 * Configuration for constructor
 * {
 *  bgEnv: environment to animate and render
 *  hero: 
 *  npcs: 
 *  npcAi: ai to invoke on npcs
 *  gameId: 
 *  onMouseDown, onMouseUp, onMouseLeftClick, onMouseRightClick, onMouseDoubleClick: handlers
 *  mouseHandlerDelay: amount of delay before the mouse event handler processes the input
 *  infoColor, infoBGColor: 
 *  loadingBarColor: 
 *  hint: hints to display while loading
 * }
 */
 class GameEngine {

  constructor(config) {
    this.config = config;
    this.bgEnv = config.bgEnv;
    this.tempObjects = [];
    this.hero = config.hero;
    this.npcs = config.npcs;
    this.camera = new GameCamera();
    this.camera.follow(this.hero);
    this.setupMouseEventHandler();
    this.npcAi = config.npcAi;
    
    this.gameLoaded = false;
    this.gameOver = false;
    this.pauseAnimation = false;
    eventBus.register(GameEngine.ADD_TMP_OBJS, e => this.tempObjects.push(e.detail.tempObj));
  }

  setupMouseEventHandler() {
    this.mouseHandler = new MouseEventHandler(this.config.mouseHandlerDelay);
    if (this.config.onMouseDown) this.mouseHandler.registerMouseDown(() => this.config.onMouseDown());
    if (this.config.onMouseUp) this.mouseHandler.registerMouseUp(() => this.config.onMouseUp());
    if (this.config.onMouseLeftClick) this.mouseHandler.registerLeftClick(() => this.config.onMouseLeftClick());
    if (this.config.onMouseRightClick) this.mouseHandler.registerRightClick(() => this.config.onMouseRightClick());
    if (this.config.onMouseDoubleClick) this.mouseHandler.registerDoubleClick(() => this.config.onMouseDoubleClick());
  }

  run() {
    if (!this.gameLoaded) {
      this.drawLoadingScreen();
      return;
    }
    this.animate();
    this.drawGameObjects();
    this.mouseHandler.run();
  }

  animate() {
    if(this.gameOver || this.pauseAnimation) return;
    this.hero.animate();
    this.hero.updateCX(this.camera.currX);
    this.npcs.forEach( npc => {
      this.npcAi.executeFor(npc);
      npc.animate();
      npc.updateCX(this.camera.currX);
    } );
    this.tempObjects.forEach( to => {
      to.animate();
      to.updateCX(this.camera.currX);
    } );
    this.bgEnv.updateCX(this.camera.dX);
    this.camera.update();
    this.checkIfGameOver();
    if (this.tempObjects.length > 100) {
      this.tempObjects = this.tempObjects.filter( t => t.active );
    }
  }

  drawGameObjects() {
    this.bgEnv.showBackGround();
    this.bgEnv.showGround();
    this.npcs.forEach( npc => npc.show() );
    this.hero.show();
    this.tempObjects.forEach( to => to.show() );
    this.bgEnv.showForeGround();
  }

  drawLoadingScreen() {
    background(0);
    this.drawLoadingBar();
    this.drawAndUpdateStatusText();
    this.drawHints();
  }

  drawLoadingBar() {
    noStroke();
    fill(this.config.loadingBarColor);
    let totalObjectsBuilt = this.bgEnv.objectsBuilt + this.npcs.filter(npc => npc.loaded).length;
    let totalObjectsToBuild = this.bgEnv.totalObjectsToBuild + 1 + this.npcs.length;
    rect(width/2 - 400, 400, map(totalObjectsBuilt, 0, totalObjectsToBuild, 0, 800), 20);
    stroke(240);
    strokeWeight(2);
    noFill();
    rect(width/2 - 400, 400, 800, 20);
  }

  drawAndUpdateStatusText() {
    let renderStatusText = statusText => {
      noStroke();
      fill(this.config.infoColor);
      textSize(12);
      textFont('sans-serif');
      let statusWidth = textWidth(statusText);
      text(statusText, width/2-statusWidth/2, 380);
    };
    if (!this.bgEnv.renderReady) {
      renderStatusText('Generating Environment');
      this.bgEnv.preRender();
      return;
    }
    if (!this.hero.loaded) {
      renderStatusText('Configuring Hero');
      this.hero.load();
      return;
    }
    if (this.hero.loaded && this.npcs.some( npc => !npc.loaded)) {
      renderStatusText('Configuring Enemies');
      (this.npcs.find( npc => !npc.loaded) ).load();
      return;
    }
    this.gameLoaded = true;
  }

  drawHints() {
    if (!this.config.hint) return;
    noStroke();
    fill(this.config.infoColor);
    textSize(12);
    textFont('sans-serif');
    let hintWidth = textWidth(this.config.hint);
    text(this.config.hint, width/2-hintWidth/2, 200);
  }

  mousePressed() {
    if (this.gameOver || this.pauseAnimation) return;
    this.mouseHandler.down();
  }

  mouseReleased() {
    if (this.gameOver || this.pauseAnimation) return;
    this.mouseHandler.up();
  }

  mouseClicked() {
    if (this.gameOver || this.pauseAnimation) return;
    this.mouseHandler.clicked();
  }

  doubleClicked() {
    if (this.gameOver || this.pauseAnimation) return;
    this.mouseHandler.doubleClicked();
  }

  checkIfGameOver() {
    if (this.gameOver) return;
    if (this.heroLost()) {
      this.gameOver = true;
      eventBus.dispatch(this.config.gameId, { event: GAME_OVER_EVENT, result: HERO_LOST });
    } else if (this.heroWon()) {
      this.gameOver = true;
      eventBus.dispatch(this.config.gameId, { event: GAME_OVER_EVENT, result: HERO_WON });
    }
  }

  heroLost() {
    return !this.hero.active;
  }

  heroWon() {
    return !this.npcs.some(npc => npc.active);
  }

}

GameEngine.ADD_TMP_OBJS = 'addTempObjects';