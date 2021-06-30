class LSystems {

  constructor() {
    this._engine = new TurtleGraphics();
    this._repo = new Repo();
  }

  loadSystem(key) {
    let system = this._repo._allSystems.get(key);
    this._lenFunc = system.lenFunc();
    this._widFunc = system.widFunc();
    this._positionFunc = system.positionFunc();
    this._initAngle = system.initAngleFunc();
    this._angleFunc = system.angleFunc();
    this._drawUnitFunc = system.drawUnitFunc();
    this._axiom = system.axiom;
    this._rules = system.rules;
    this._maxGenerations = system.maxGenerations;

    this._engine.resetCustomOpsMap();
    this._hasCustomOps = false;
    if (system.customOps) {
      this._hasCustomOps = true;
      this._customOps = system.customOps;
    }
    this.resetVariables();
  }

  nextGeneration() {
    if (this._currentGeneration >= this._maxGenerations) return;
    let output = '';
    for (let i = 0; i < this._currentString.length; i++) {
      let c = this._currentString.charAt(i);
      let found = false;
      for (let r of this._rules) {
        if (r.match(c)) {
          output += r.output();
          found = true;
          break;
        }
      }
      if (!found)
        output += c;
    }
    this._currentString = output;
    this._currentGeneration++;
    this.updateEngine();
  }

  updateEngine() {
    this._engine.setDrawUnitFunction(this._drawUnitFunc);
    this._engine.setInit(
      this._positionFunc(this._currentGeneration), this._initAngle(this._currentGeneration));
    this._engine.setLen(this._lenFunc(this._currentGeneration));
    this._engine.setWid(this._widFunc(this._currentGeneration));
    this._engine.setAngle(this._angleFunc(this._currentGeneration));
    if (this._hasCustomOps) {
      for (let { command, func } of this._customOps) {
        this._engine.addCustomeOp(command, func);
      }
    }
  }

  render() {
    this._engine.render(this._currentString);
  }

  resetVariables() {
    this._currentGeneration = 0;
    this._currentString = this._axiom;
    this.updateEngine();
  }
}

class LRule {
  constructor(input, output) {
    this._input = input;
    this._output = output;
  }

  match(input) {
    return this._input == input;
  }

  output() {
    return this._output;
  }
}

class ChanceLRule extends LRule {
  constructor(input, output, chance) {
    super(input, output);
    this._chance = chance;
  }

  output() {
    return random(1) < this._chance ? this._output : '';
  }
}