class NpcVanara extends NpcCharacter {

  constructor() {
    super('vanara', vanaraJSON);
  }

  primaryAction() {
    if (!this.enabledActions.includes(CHAR_PRIMARY_ATTACK)
     || !this.chState.updateState(CHAR_PRIMARY_ATTACK)) return;
    this.dx = 1 * this.direction;
    this.anim.setWithCallback('action1', () => this.idle());
    let damagingArc = new DamagingArc({
      start: createVector(this.x + 20, this.y - 50),  
      trailArcTotalFrames: (CharacterAnimator.SWITCH_FRAME_RATE * 4), 
      strokeWeight: 15, 
      arcToAdd: [100, 30], 
      arcDirection: TrailArc.ANTICLOCKWISE, 
      center: createVector(this.x - 10, this.y + 10), 
      numberOfFramesBeforeLaunch: (CharacterAnimator.SWITCH_FRAME_RATE * 4), 
      color: this.effectColor, 
      collX: -110, collY: -60, collW: 100, collH: 140, 
      x: this.x, y: this.y, 
      damage: this.chAttributes.calculateActionDamage(CHAR_PRIMARY_ATTACK)
    });
    damagingArc.addTarget(this.hero);
    this.cancelableActions.push(damagingArc);
    this.addTempObjectsToEngine(damagingArc);
  }

  secondaryAction() {
    if (!this.enabledActions.includes(CHAR_SECONDARY_ATTACK)
     || !this.chState.updateState(CHAR_SECONDARY_ATTACK)) return;
    this.dx = 3 * this.direction;
    this.anim.setWithCallback('action2', () => this.idle());
    let damagingArc = new DamagingArc({
      start: createVector(this.x + 20, this.y - 50),  
      trailArcTotalFrames: (CharacterAnimator.SWITCH_FRAME_RATE * 4), 
      strokeWeight: 20, 
      arcToAdd: [90, 50], 
      arcDirection: TrailArc.ANTICLOCKWISE, 
      center: createVector(this.x - 40, this.y + 10), 
      numberOfFramesBeforeLaunch: (CharacterAnimator.SWITCH_FRAME_RATE * 6), 
      color: this.effectColor, 
      collX: -120, collY: -70, collW: 120, collH: 140, 
      x: this.x, y: this.y, 
      damage: this.chAttributes.calculateActionDamage(CHAR_SECONDARY_ATTACK)
    });
    damagingArc.addTarget(this.hero);
    this.cancelableActions.push(damagingArc);
    this.addTempObjectsToEngine(damagingArc);
  }

}