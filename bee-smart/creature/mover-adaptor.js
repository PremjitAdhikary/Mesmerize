class MoverAdaptor {
  
  constructor(creature) {
    this.creature = creature;
  }
  get _location() { return this.creature._position; }
  get _angle() { return this.creature._velocity.heading(); }
  isMoving() { return this.creature._active; }

}