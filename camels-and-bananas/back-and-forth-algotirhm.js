class BackAndForthAlgorithm {
  constructor(camel) {
    this.camel = camel;
    this.stepIdx = 0;
    this.steps = [
      () => this.camel.pickUpMax(),
      () => this.moveForward(),
      () => this.camel.drop(),
      () => this.moveBackward()
    ];
  }

  run() {
    if (this.camel.position == routeLength-1) return;
    while (!this.steps[this.stepIdx%4]()) { this.stepIdx++; }
    this.stepIdx++;
  }

  moveForward() {
    let canMoveForward = this.camel.position < routeLength;
    if (!canMoveForward) return false;
    this.camel.position++;
    this.camel.eat();
    return true;
  }

  moveBackward() {
    let canMoveBackward = this.camel.position >= 0;
    let hasPickupBehind = (this.camel.position == 0) ? routeStart.bananas > 1 : theRoute[this.camel.position-1].bananas > 1;
    if (!canMoveBackward || !hasPickupBehind) return false;
    this.camel.position--;
    this.camel.pickOneAndEat();
    return true;
  }

}