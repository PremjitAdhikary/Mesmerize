/**
 * Configuration for constructor
 * 
 * {
 *   character: name of Character
 *   direction: left or right?
 *   initialState: mostly idle
 * }
 * 
 * Actual properties are built and set in the Character builder. These are:
 * - x,y: position
 * - speed: max movement speed
 * - cSprite: sprite image for rendering
 * - id: to identify
 * - gapDistance: minimum gap distance to maintain with nearby characters
 * - chAttributes: character attributes
 * - actions: action attributes
 * - regenerateInterval: interval at which life is regerated
 */
class BaseCharacter {

  constructor(config) {
    this.config = config;
    this.direction = config.direction;
    this.gapDistanceColor = SketchColor.yellow().alpha(0.25).stringify();
    this.dx = 0;
    this.chState = new CharacterState(config.initialState);
    this.loaded = false;
    this.active = true;
    this.intervalRunners = [];
    this.enabledActions = [];
    this.cancelableActions = [];
    this.actionMap = new Map();
  }

  load() {
    this.anim = new CharacterAnimator(this.config.character, this.cSprite, this.cJSON);
    this.anim.isDebugOn = () => debug;
    this.anim.loadAnimationData(() => this.loaded = true);
  }

  registerIntervalRunners(intervalRunner) {
    this.intervalRunners.push(intervalRunner);
  }

  enableAction(action) {
    if (!this.enabledActions.includes(action)) this.enabledActions.push(action);
  }

  disableAction(action) {
    this.enabledActions = this.enabledActions.filter( t => t != action );
  }

  validateAction(state) {
    return this.enabledActions.includes(state) && this.chState.updateState(state);
  }

  animate() {
    if (!this.active) return;
    this.x += this.dx;
    this.intervalRunners.forEach(ir => ir());
    this.anim.animate();
  }

  getCollisionBox() {
    return this.anim.getCollisionBox(this.x - this.cX, this.y);
  }

  updateCX(cx) {
    this.cX = cx;
  }

  get state() {
    return this.chState.state;
  }

}

BaseCharacter.DIRECTION_LEFT = -1;
BaseCharacter.DIRECTION_RIGHT = 1;

class CharacterState {
  constructor(initialState) {
    this.state = initialState;
    this.possibleNextStates = new Map();
  }

  /**
   * Configure the next possible states
   * @param {string} currentState 
   * @param {string[]} nextStates 
   */
  addPossibleNextStates(currentState, nextStates) {
    this.possibleNextStates.set(currentState, nextStates);
  }

  /**
   * Checks if state change is possible and updates it
   * @param {string} state state to be updated to
   * @param {boolean} forced if set to true, force update the state
   * @returns true/false based on update sucessful/failed
   */
  updateState(state, forced = false) {
    if (forced || this.possibleNextStates.get(this.state).includes(state)) {
      this.state = state;
      return true;
    }
    return false;
  }
}

/**
 * Holds the attributes like life, armor, strength and their multipliers
 * Has methods to perform damage calculations
 */
class CharacterAttributes {

  constructor(config) {
    this.maxLife = config.maxLife;
    this.currentLife = config.maxLife;
    this.originalArmor = config.originalArmor;
    this.armorMultiplier = config.armorMultiplier;
    this.originalStrength = config.originalStrength;
    this.strengthMultiplier = config.strengthMultiplier;
    this.actions = new Map();
  }

  /**
   * @param {ActionAttributes} action 
   */
  addAction(action) {
    this.actions.set(action.type, action);
  }

  getAction(type) {
    return this.actions.get(type);
  }

  calculateActionDamage(type) {
    return CharacterAttributes.calulateDamageWithStrengthEnhanced(
      this.actions.get(type).calculateDamage(), this.originalStrength, this.strengthMultiplier
    );
  }

  calculateDamageIncurred(baseDamage) {
    return CharacterAttributes.calulateDamageWithArmorReduced(
      baseDamage, this.originalArmor, this.armorMultiplier);
  }

  addStrengthMultiplier(strengthMultiplier) {
    this.strengthMultiplier += strengthMultiplier;
  }

  addArmorMultiplier(armorMultiplier) {
    this.armorMultiplier += armorMultiplier;
  }

  addLife(life) {
    this.currentLife += life;
    this.currentLife = Math.min(this.currentLife, this.maxLife);
    this.currentLife = Math.max(this.currentLife, 0);
  }

}

CharacterAttributes.calulateDamageWithStrengthEnhanced = 
  (damage, strength, multiplier) => Math.floor(damage * strength * multiplier);

CharacterAttributes.calulateDamageWithArmorReduced = 
  (damage, armor, multiplier) => Math.floor(damage * 20 / (20 + armor * multiplier));

/**
 * Every action (hit) has a min and a max damage configured. calculateDamage() returns a value 
 * between them.
 * 
 * Every action has an associated cooldown before which it can be executed again. cool() is called 
 * to trigger cooldown. cooldownMultiplier affects the speed of cooldown (inversely).
 * 
 * The range configured gives the range at which the action can be executed. This is more for 
 * the NPC AI.
 * 
 * The initiative is also used by AI to detect how frequently the action will be executed.
 */
class ActionAttributes {

  constructor(config) {
    this.name = config.name;
    this.type = config.type;
    this.minDamage = config.minDamage;
    this.maxDamage = config.maxDamage;
    this.range = config.range;
    this.initiative = config.initiative;
    this.cooldown = config.cooldown;
    this.cooldownMultiplier = 1;
    this.currentCooldown = 0;
    this._executed = false;
  }

  calculateDamage() {
    return random(this.minDamage, this.maxDamage)
  }

  execute() {
    this._executed = true;
    this.currentCooldown = Math.floor(this.cooldown * this.cooldownMultiplier);
  }

  get executed() { return this._executed; }

  cool() {
    if (this.currentCooldown > 0) this.currentCooldown--;
    if (this.currentCooldown == 0) this._executed = false;
  }
}