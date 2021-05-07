class RandomAI extends BaseAI {

  constructor(lightCycle) {
    super(lightCycle, 60, 15);
    // this._lightCycle = lightCycle;
    // this._commandCooldownCounter = 0;
    // this._commandCooldownThreshHold = 60;
  }

  command() {
    if (!this.isCommandEnabled()) 
      return;
    // if (!this._lightCycle.isActive()) 
    //   return;
    // if (!this.readyToCommand())
    //   return;

    if (random(100) > 50) {
      this._lightCycle.left();
    } else {
      this._lightCycle.right();
    }
  }

  // readyToCommand() {
  //   this._commandCooldownCounter++;
  //   if (this.isCommandInCooldown() || this.failedChanceToExecuteCommand()) {
  //     return false;
  //   }
  //   this._commandCooldownCounter = 0;
  //   return true;
  // }

  // isCommandInCooldown() {
  //   return (this._commandCooldownCounter < this._commandCooldownThreshHold);
  // }

  // failedChanceToExecuteCommand() {
  //   return (random(15) > (this._commandCooldownCounter - this._commandCooldownThreshHold));
  // }
  
}