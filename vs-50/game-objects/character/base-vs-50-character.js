class BaseVs50Character extends BaseCharacter {

  constructor(config) {
    super(config);
    this.chState.addPossibleNextStates(CHAR_IDLE, [CHAR_FORWARD, CHAR_DEFEND, CHAR_PRIMARY_ATTACK, CHAR_SECONDARY_ATTACK, CHAR_HIT, CHAR_DEAD]);
    this.chState.addPossibleNextStates(CHAR_FORWARD, [CHAR_IDLE, CHAR_HIT, CHAR_DEAD]);
    this.chState.addPossibleNextStates(CHAR_DEFEND, [CHAR_IDLE, CHAR_HIT, CHAR_DEAD]);
    this.chState.addPossibleNextStates(CHAR_PRIMARY_ATTACK, [CHAR_HIT, CHAR_DEAD]);
    this.chState.addPossibleNextStates(CHAR_SECONDARY_ATTACK, [CHAR_HIT, CHAR_DEAD]);
    this.chState.addPossibleNextStates(CHAR_HIT, [CHAR_HIT, CHAR_DEAD]);
    this.chState.addPossibleNextStates(CHAR_DEAD, []);
    this.enabledActions.push(CHAR_IDLE);
    this.enabledActions.push(CHAR_HIT);
    this.enabledActions.push(CHAR_DEAD);
  }

  load() {
    super.load();
    this.actionMap.set(CHAR_FORWARD, () => this.forward());
    this.actionMap.set(CHAR_STOP, () => this.stop());
    this.actionMap.set(CHAR_DAMAGE, detail => this.damage(detail.damage));
    eventBus.register(this.id, e => {
      if (this.actionMap.has(e.detail.action)) this.actionMap.get(e.detail.action)(e.detail);
    });
  }

  // common actions

  idle() {
    if (!this.enabledActions.includes(CHAR_IDLE)) return;
    this.chState.updateState(CHAR_IDLE, true);
    this.dx = 0;
    this.anim.resetToDefault();
  }

  forward() {
    if (this.validateAction(CHAR_FORWARD)) {
      this.dx = this.speed * this.direction;
      this.anim.set('forward', true);
    }
  }

  stop() {
    if (this.validateAction(CHAR_IDLE)) {
      this.dx = 0;
      this.anim.resetToDefault();
    }
  }

  hit() {
    if (this.validateAction(CHAR_HIT)) {
      this.dx = 8 * (-this.direction);
      this.anim.setWithCallback('hit', () => this.idle());
    }
  }

  dead() {
    if (this.validateAction(CHAR_DEAD)) {
      this.dx = 4 * (-this.direction);
      this.anim.setWithCallback('die', () => this.active = false);
    }
  }

  damage(amount) {
    let damage = this.chAttributes.calculateDamageIncurred(amount);
    this.chAttributes.addLife(-damage);
    this.cancelableActions.filter(action => action.active).forEach(action => action.deactivate());
    if (this.chAttributes.currentLife > 0)
      this.hit();
    else
      this.dead();
  }

  addTempObjectsToEngine(tempObj) {
    eventBus.dispatch(GameEngine.ADD_TMP_OBJS, { tempObj });
  }

}