/**
 * Basic Damager. Usually paired with attack animation
 * Configuration for constructor:
 * {
 *  numberOfFramesBeforeLaunch: number of frames to idle out before animation starts
 *  numberOfFramesAfterLaunch: number of frames animation stays active
 *  collX, collY, collW, collH: describes the collision box
 *  x, y: position
 *  damage: amount of damage to dish when collides with target
 *  cancelableCriteria: if the attack animation has to be cancelled mid animation
 * }
 */
class DamagingDummy {

  constructor(config) {
    this.numberOfFramesBeforeLaunch = config.numberOfFramesBeforeLaunch;
    this.numberOfFramesAfterLaunch = config.numberOfFramesAfterLaunch;
    this.launched = false;
    this.collX = config.collX;
    this.collY = config.collY;
    this.collW = config.collW;
    this.collH = config.collH;
    this.active = true;
    this.x = config.x;
    this.y = config.y;
    this.cancelableCriteria = config.cancelableCriteria ? config.cancelableCriteria : () => true;
    this.damage = config.damage;
    this.targets = [];
  }

  animate() {
    if (!this.active) return;
    if (!this.launched) {
      this.runPreLaunch();
      return;
    }
    this.engageTarget();
    this.runPostLaunch();
  }

  runPreLaunch() {
    this.numberOfFramesBeforeLaunch--;
    if (this.numberOfFramesBeforeLaunch <= 0) this.launched = true;
  }

  engageTarget() {
    this.targets.filter(t => !t.hit && t.target.state != CHAR_DEAD).forEach(t => {
      let targetCollBox = t.target.getCollisionBox();
      if (collideRectRect(
          targetCollBox.x, targetCollBox.y, targetCollBox.w, targetCollBox.h, 
          this.x - this.cX + this.collX, this.y + this.collY, this.collW, this.collH)) {
        eventBus.dispatch(t.target.id, { action: CHAR_DAMAGE, damage: this.damage });
        t.hit = true;
      }
    });
  }

  runPostLaunch() {
    this.numberOfFramesAfterLaunch--;
    if (this.numberOfFramesAfterLaunch <= 0) this.active = false;
  }

  show() {
    if (!this.active) return;
    if (!this.launched) return;
    this.showDebug();
  }

  showDebug() {
    if (!debug) return;
    stroke(0);
    strokeWeight(2);
    noFill();
    rect(this.x - this.cX + this.collX, this.y + this.collY, this.collW, this.collH);
  }

  addTarget(target) {
    this.targets.push({target: target, hit: false});
  }

  updateCX(cx) {
    this.cX = cx;
  }

  deactivate() {
    if (this.cancelableCriteria(this))
      this.active = false;
  }

}