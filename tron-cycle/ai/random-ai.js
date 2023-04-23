class RandomAI extends BaseAI {

  constructor(lightCycle) {
    super(lightCycle, 60, 15);
  }

  command() {
    if (!this.isCommandEnabled()) 
      return;

    if (random(100) > 50) {
      this._lightCycle.left();
    } else {
      this._lightCycle.right();
    }
  }
  
}