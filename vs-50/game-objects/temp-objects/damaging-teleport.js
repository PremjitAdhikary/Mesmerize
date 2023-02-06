/**
 * Configuration for constructor
 * {
 *  startWidth, endWidth: shape of the arc
 *  color: color of the arc
 *  teleporter: whom to teleport
 *  numberOfFramesBeforeLaunch: number of frames to idle out before animation starts
 *  numberOfFramesAfterLaunch: number of frames animation stays active
 *  collX: collY: collW:, collH: describes the collision box
 *  x:, y: position
 *  damage: amount of damage to dish when collides with target
 *  cancelableCriteria: if the attack animation has to be cancelled mid animation
 * }
 */
 class DamagingTeleport extends DamagingDummy {

  constructor(config) {
    super({
      numberOfFramesBeforeLaunch: config.numberOfFramesBeforeLaunch, 
      collX: config.collX, collY: config.collY, collW: config.collW, collH: config.collH, 
      y: config.y, 
      damage: config.damage
    });
    this.teleportTrail = new TeleportLine({
      start: createVector(config.x, config.y), 
      end: createVector(config.x, config.y), z: 3, 
      startWidth: config.startWidth, endWidth: config.endWidth, 
      totalFrames: config.numberOfFramesAfterLaunch, 
      color: config.color
    });
    this.teleporter = config.teleporter;
  }

  show() {
    if (!this.active) return;
    if (!this.launched) return;
    this.teleportTrail.render(this.cX);
    this.showDebug();
  }

  runPreLaunch() {
    this.numberOfFramesBeforeLaunch--;
    if (this.numberOfFramesBeforeLaunch > 0) return;
    this.launched = true;
    this.teleporter.x = this.targets[0].target.x + 100;
    this.x = this.teleporter.x;
    this.teleportTrail.updateEnd(createVector(this.teleporter.x, this.teleporter.y));
  }

  runPostLaunch() {
    if (this.teleportTrail.removeObj) this.active = false
  }

}