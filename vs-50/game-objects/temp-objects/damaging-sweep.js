/**
 * Configuration for constructor
 * {
 *  sweepArcTotalFrames: how long to animate
 *  sweepStartA, sweepStopA, sweepW, sweepH, strokeWeight, direction: shape of the arc
 *  speed: arc speed
 *  center: center of the arc
 *  color: color of the arc
 *  numberOfFramesBeforeLaunch: number of frames to idle out before animation starts
 *  numberOfFramesAfterLaunch: number of frames animation stays active
 *  collX: collY: collW:, collH: describes the collision box
 *  x:, y: position
 *  damage: amount of damage to dish when collides with target
 *  cancelableCriteria: if the attack animation has to be cancelled mid animation
 * }
 */
 class DamagingSweep extends DamagingDummy {

  constructor(config) {
    super({
      numberOfFramesBeforeLaunch: config.numberOfFramesBeforeLaunch, 
      numberOfFramesAfterLaunch: 2, // doesnt matter
      collX: config.collX, collY: config.collY, collW: config.collW, collH: config.collH, 
      x: config.x, y: config.y, 
      cancelableCriteria: config.cancelableCriteria,  
      damage: config.damage
    });
    this.arc = new SweepArc({
      center: config.center, z: 3, 
      totalFrames: config.sweepArcTotalFrames, 
      strokeWeight: config.strokeWeight, 
      speed: config.speed, 
      w: config.sweepW, h: config.sweepH, 
      startA: config.sweepStartA, stopA: config.sweepStopA, 
      color: config.color
    });
    this.direction = config.direction;
  }

  animate() {
    super.animate();
    if (!this.active || !this.launched) return;
    this.collX += (this.arc.config.speed/2 * this.direction);
  }

  show() {
    if (!this.active) return;
    if (!this.launched) return;
    this.arc.render(this.cX);
    this.showDebug();
  }

  runPostLaunch() {
    if (this.arc.removeObj) this.active = false
  }

}