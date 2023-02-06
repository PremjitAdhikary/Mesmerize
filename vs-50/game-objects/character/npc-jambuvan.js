class NpcJambuvan extends NpcCharacter {

  constructor() {
    super('jambuvan', jambuvanJSON);
  }

  primaryAction() {
    if (!this.enabledActions.includes(CHAR_PRIMARY_ATTACK)) return;
    if (this.chState.updateState(CHAR_PRIMARY_ATTACK)) {
      this.dx = 1 * this.direction;
      this.anim.setWithCallback('action1', () => this.idle());
      
      let damagingDummy = new DamagingDummy({
        numberOfFramesBeforeLaunch: CharacterAnimator.SWITCH_FRAME_RATE * 4, 
        numberOfFramesAfterLaunch: CharacterAnimator.SWITCH_FRAME_RATE * 4, 
        collX: -115, collY: -20, collW: 20, collH: 20, 
        x: this.x, y: this.y, 
        damage: this.chAttributes.calculateActionDamage(CHAR_PRIMARY_ATTACK)
      });
      damagingDummy.addTarget(this.hero);
      this.cancelableActions.push(damagingDummy);
      this.addTempObjectsToEngine(damagingDummy);
    }
  }

  secondaryAction() {
    if (!this.enabledActions.includes(CHAR_SECONDARY_ATTACK)) return;
    if (this.chState.updateState(CHAR_SECONDARY_ATTACK)) {
      this.dx = 1 * this.direction;
      this.anim.setWithCallback('action2', () => this.idle());
      
      let damagingTeleport = new DamagingTeleport({
        numberOfFramesBeforeLaunch: CharacterAnimator.SWITCH_FRAME_RATE * 7, 
        numberOfFramesAfterLaunch: CharacterAnimator.SWITCH_FRAME_RATE * 6, 
        collX: -115, collY: -40, collW: 30, collH: 60, 
        x: this.x, y: this.y + 10, 
        damage: this.chAttributes.calculateActionDamage(CHAR_SECONDARY_ATTACK), 
        startWidth: 10, endWidth: 20, 
        teleporter: this, 
        color: this.effectColor
      });
      damagingTeleport.addTarget(this.hero);
      this.cancelableActions.push(damagingTeleport);
      this.addTempObjectsToEngine(damagingTeleport);
    }
  }

}