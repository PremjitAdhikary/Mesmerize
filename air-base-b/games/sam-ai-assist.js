/**
 * Assists in commanding SAM vehicle.
 * Takes responsibility to:
 *  - move vehicle out of danger
 *  - reload missiles
 *  - once missiles are reloaded, bring it back to action
 * Only reponsibility of the player is to fire the missiles
 */
class SAMAIAssist {

  constructor(sam) {
    this.sam = sam;
  }

  run() {
    if (this.sam.hasNoMissiles() && this.canGoRight()) {
      this.sam.moveRight();
      return;
    }
    if (this.sam.hasNoMissiles() && !this.canGoRight() && !this.sam.reloadEnabled) {
      this.sam.reload();
      return;
    }
    if (!this.sam.hasNoMissiles() && this.canGoLeft()) {
      this.sam.moveLeft();
      return;
    }
  }

  canGoRight = () => this.sam.x < this.sam.maxX;

  canGoLeft = () => this.sam.x > this.sam.minX;
}