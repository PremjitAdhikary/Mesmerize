class NpcVali extends NpcCharacter {

  constructor() {
    super('vali', valiJSON);
  }

  primaryAction() {
    if (!this.enabledActions.includes(CHAR_PRIMARY_ATTACK)) return;
    if (this.chState.updateState(CHAR_PRIMARY_ATTACK)) {
      this.dx = 3 * this.direction;
      this.anim.setWithCallback('action1', () => this.idle());
      let damage = Math.ceil(this.chAttributes.calculateActionDamage(CHAR_PRIMARY_ATTACK)/2);

      let firstDamagingArc = new DamagingArc({
        start: createVector(this.x + 20, this.y - 50),  
        trailArcTotalFrames: (CharacterAnimator.SWITCH_FRAME_RATE * 3), 
        strokeWeight: 20, 
        arcToAdd: [100, 50], 
        arcDirection: TrailArc.ANTICLOCKWISE, 
        center: createVector(this.x - 50, this.y + 10), 
        numberOfFramesBeforeLaunch: (CharacterAnimator.SWITCH_FRAME_RATE * 4), 
        color: this.effectColor, 
        collX: -150, collY: -30, collW: 150, collH: 100, 
        x: this.x, y: this.y, 
        damage
      });
      firstDamagingArc.addTarget(this.hero);
      this.cancelableActions.push(firstDamagingArc);
      this.addTempObjectsToEngine(firstDamagingArc);
      
      let secondDamagingArc = new DamagingArc({
        start: createVector(this.x + 20, this.y - 50),  
        trailArcTotalFrames: (CharacterAnimator.SWITCH_FRAME_RATE * 3), 
        strokeWeight: 20, 
        arcToAdd: [100, 50], 
        arcDirection: TrailArc.ANTICLOCKWISE, 
        center: createVector(this.x - 120, this.y + 15), 
        numberOfFramesBeforeLaunch: (CharacterAnimator.SWITCH_FRAME_RATE * 11), 
        color: this.effectColor, 
        collX: -275, collY: -30, collW: 150, collH: 100, 
        x: this.x, y: this.y, 
        damage
      });
      secondDamagingArc.addTarget(this.hero);
      this.cancelableActions.push(secondDamagingArc);
      this.addTempObjectsToEngine(secondDamagingArc);
    }
  }

  secondaryAction() {
    if (!this.enabledActions.includes(CHAR_SECONDARY_ATTACK)) return;
    if (this.chState.updateState(CHAR_SECONDARY_ATTACK)) {
      this.dx = 0;
      this.anim.setWithCallback('action2', () => this.idle());
      let calculatedDamage = this.chAttributes.calculateActionDamage(CHAR_SECONDARY_ATTACK);
      let damage = Math.ceil(map(this.x - this.hero.x, 0, width, calculatedDamage/2, calculatedDamage));

      let damagingSweep = new DamagingSweep({
          numberOfFramesBeforeLaunch: CharacterAnimator.SWITCH_FRAME_RATE * 10, 
          numberOfFramesAfterLaunch: CharacterAnimator.SWITCH_FRAME_RATE * 2, 
          sweepArcTotalFrames: 100, 
          center: createVector(this.x - 10, this.y + 10), 
          x: this.x, y: this.y, 
          strokeWeight: 30, 
          speed: 20, 
          collX: -115, collY: -40, collW: 30, collH: 60, 
          sweepW: 200, sweepH: 100, 
          sweepStartA: 180, sweepStopA: 200, 
          color: this.effectColor, 
          direction: this.direction, 
          cancelableCriteria: sweep => !sweep.launched,  
          damage
      });
      damagingSweep.addTarget(this.hero);
      this.cancelableActions.push(damagingSweep);
      this.addTempObjectsToEngine(damagingSweep);
    }
  }

}