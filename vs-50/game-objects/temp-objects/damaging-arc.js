/**
 * Configuration for constructor
 * {
 *  start: start of the arc
 *  trailArcTotalFrames: how long to animate
 *  arcToAdd, strokeWeight, arcDirection: shape of the arc
 *  center: center of the arc
 *  color: color of the arc
 *  numberOfFramesBeforeLaunch: number of frames to idle out before animation starts
 *  collX: collY: collW:, collH: describes the collision box
 *  x:, y: position
 *  damage: amount of damage to dish when collides with target
 *  cancelableCriteria: if the attack animation has to be cancelled mid animation
 * }
 */
class DamagingArc extends DamagingDummy {

  constructor(config) {
    super({
      numberOfFramesBeforeLaunch: config.numberOfFramesBeforeLaunch, 
      numberOfFramesAfterLaunch: 2, // doesnt matter
      collX: config.collX, collY: config.collY, collW: config.collW, collH: config.collH, 
      x: config.x, y: config.y, 
      damage: config.damage
    });
    this.arc = new TrailArc({
      start: config.start, z: 3, 
      totalFrames: config.trailArcTotalFrames, 
      strokeWeight: config.strokeWeight, 
      strokeCap: PROJECT, 
      arcToAdd: config.arcToAdd, 
      arcDirection: config.arcDirection, 
      center: config.center, 
      color: config.color
    });
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