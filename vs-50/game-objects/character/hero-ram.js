/**
 * Along with properties for base character, for ram there are some addtional ones. These are:
 * - stylizedArrow: determines if the arrow to be generated is stylized or noir
 */
class HeroRam extends BaseVs50Character {

  constructor() {
    super({
      character: 'ram', 
      direction: BaseCharacter.DIRECTION_RIGHT, 
      initialState: CHAR_IDLE
    });
    this.cJSON = ramJSON;
  }

  load() {
    super.load();
    this.actionMap.set(CHAR_DEFEND, () => this.defend());
    this.actionMap.set(CHAR_PRIMARY_ATTACK, () => this.primaryAction());
    this.actionMap.set(CHAR_SECONDARY_ATTACK, () => this.secondaryAction());
  }

  animate() {
    if (!this.active) return;
    this.assistAi.executeCollisionAvoidance();
    super.animate();
  }

  show() {
    if (!this.active) return;
    this.anim.show(this.x - this.cX, this.y);
    this.showDebug();
  }

  showDebug() {
    if (!debug) return;
    noStroke();
    fill(this.gapDistanceColor);
    rect(this.x - this.cX, this.y, this.gapDistance, 20);
  }

  defend() {
    if (this.validateAction(CHAR_DEFEND)) {
      this.dx = this.speed/2 * (-this.direction);
      this.anim.set('back', true);
    }
  }

  primaryAction() {
    if (!this.enabledActions.includes(CHAR_PRIMARY_ATTACK)) return;
    if (this.chAttributes.getAction(CHAR_PRIMARY_ATTACK).executed) return;
    if (this.chState.updateState(CHAR_PRIMARY_ATTACK)) {
      this.chAttributes.getAction(CHAR_PRIMARY_ATTACK).execute();
      this.dx = 0;
      this.anim.setWithCallback('action1', () => this.idle());
      this.addTempObjectsToEngine(this.buildArrow(this.x + 15, this.y - 15, 
        50, 14, 1, 3, this.chAttributes.calculateActionDamage(CHAR_PRIMARY_ATTACK), 
        this.assistAi.executeFindNearestTarget()));
    }
  }

  secondaryAction() {
    if (!this.enabledActions.includes(CHAR_SECONDARY_ATTACK)) return;
    if (this.chAttributes.getAction(CHAR_SECONDARY_ATTACK).executed) return;
    if (this.chState.updateState(CHAR_SECONDARY_ATTACK)) {
      this.dx = 0;
      this.anim.setWithCallback('action2', () => this.idle());
      this.chAttributes.getAction(CHAR_SECONDARY_ATTACK).execute();

      let topArrow = (damage, target) => this.buildArrow(this.x + 5, this.y - 18, 
        55, 14, 1, 6, damage, target);
      let midArrow = (damage, target) => this.buildArrow(this.x, this.y - 9, 
        62, 18, 1, 6, damage, target);
      let bottomArrow = (damage, target) => this.buildArrow(this.x + 6, this.y - 2, 
        55, 12, 1, 6, damage, target);
      let calculateDamage = totalTargets => {
        let actionDamage = this.chAttributes.calculateActionDamage(CHAR_SECONDARY_ATTACK)
        switch(totalTargets) {
          case 0: return 1;
          case 1: return actionDamage;
          case 2: return Math.ceil(actionDamage/2);
          default: return Math.ceil(actionDamage/3);
        }
      };

      let targets = this.assistAi.executeFindAllNearestTargets();
      let targetDamage = calculateDamage(targets.length);

      if (targets.length == 0) {
        this.addTempObjectsToEngine(topArrow(targetDamage));
        this.addTempObjectsToEngine(midArrow(targetDamage));
        this.addTempObjectsToEngine(bottomArrow(targetDamage));
        return;
      }
      if (targets.length >= 1) this.addTempObjectsToEngine(midArrow(targetDamage, targets[0]));
      if (targets.length >= 2) this.addTempObjectsToEngine(topArrow(targetDamage, targets[1]));
      if (targets.length >= 3) this.addTempObjectsToEngine(bottomArrow(targetDamage, targets[2]));
    }
  }

  buildArrow(x, y, len, speed, beforeFadeInFramesMultiplier, forFadeInFramesMultiplier, 
    damage, target) {
    let arrowConfig = {
      x, y, len, maxSpeed: speed, 
      numOfFramesBeforeFadeIn: CharacterAnimator.SWITCH_FRAME_RATE * beforeFadeInFramesMultiplier, 
      numOfFramesForFadeIn: (CharacterAnimator.SWITCH_FRAME_RATE * forFadeInFramesMultiplier), 
      damage
    };
    let arrow = this.stylizedArrow ? new StylizedArrow(arrowConfig) : new Arrow(arrowConfig);
    if (target) {
      arrow.addTarget(target);
    }
    this.cancelableActions.push(arrow);
    return arrow;
  }

  damage(amount) {
    let newAmount = (this.state == CHAR_DEFEND ? amount /= 2 : amount);
    super.damage(newAmount);
  }

  addNpcs(npcs) {
    this.assistAi = new HeroAssistAi(this, npcs);
  }

}