class BgEnv {
  
  constructor(setupEnv) {
    this.sky;
    this.behindGround = [];
    this.frontOfGround = [];
    setupEnv(this);
  }

  preRender() {
    if (this.renderReady) return;
    let bGround = this.behindGround.find(e => !e.renderReady);
    if (bGround) {
      bGround.preRender();
      return;
    }
    if (!this.ground.renderReady) {
      this.ground.preRender();
      return;
    }
    let foGround = this.frontOfGround.find(e => !e.renderReady);
    if (foGround) {
      foGround.preRender();
      return;
    }
  }

  showBackGround() {
    if (!this.renderReady) return;
    for (let e of this.behindGround) e.render();
  }

  showGround() {
    if (!this.renderReady) return;
    this.ground.render();
  }

  showForeGround() {
    if (!this.renderReady) return;
    for (let e of this.frontOfGround) e.render();
  }

  updateCX(cX) {
    [...this.behindGround, ...this.frontOfGround, this.ground].forEach( e => e.updateCX(e.cX + cX));
  }

  get renderReady() {
    return this.behindGround.every( e => e.renderReady ) 
      && this.frontOfGround.every( e => e.renderReady );
  }

  get objectsBuilt() { 
    return this.behindGround.map( e => e.objectsBuilt ).reduce( (a, b) => a + b, 0 );
  }

  get totalObjectsToBuild() {
    return this.behindGround.map( e => e.totalObjects ).reduce( (a, b) => a + b, 0 );
  }

}

BgEnv.setupForest = () => new BgEnv(EnvConfig.BW_FOREST_SETUP);

BgEnv.setupSlimForest = () => new BgEnv(EnvConfig.SLIM_FOREST_SETUP);

BgEnv.setupStylizedForest = () => new BgEnv(EnvConfig.STYLIZED_FOREST_SETUP);

BgEnv.GROUND_LEVEL = 400;