class BaseAI {

  constructor(lightCycle, commandCooldownThreshHold, commandExecutionSuccessRate) {
    this._lightCycle = lightCycle;
    this._commandCooldownCounter = 0;
    this._commandCooldownThreshHold = commandCooldownThreshHold;
    this._commandExecutionSuccessRate = commandExecutionSuccessRate;
  }

  isCommandEnabled() {
    if (!this._lightCycle.isActive()) 
      return false;
    return this.readyToCommand();
  }

  readyToCommand() {
    this._commandCooldownCounter++;
    if (this.isCommandInCooldown() || this.failedChanceToExecuteCommand()) {
      return false;
    }
    this._commandCooldownCounter = 0;
    return true;
  }

  isCommandInCooldown() {
    return (this._commandCooldownCounter < this._commandCooldownThreshHold);
  }

  failedChanceToExecuteCommand() {
    return (random(this._commandExecutionSuccessRate) < 
      (this._commandCooldownCounter - this._commandCooldownThreshHold));
  }

}