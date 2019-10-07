class BaseClock {

  constructor() {
    this._hr_color = SketchColor.greenyellow().stringify();
    this._min_color = SketchColor.blend(SketchColor.violet(), SketchColor.white()).stringify();
    this._sec_color = SketchColor.blend(SketchColor.red(), SketchColor.white()).stringify();
    this._millis_color = SketchColor.blend(SketchColor.blue(), SketchColor.white()).stringify();
  }

  millisAngle() {
    return map(floor((millis()%1000)/50), 0, 20, 0, 360);
  }

  millisLength(totalLength) {
    return map(floor(millis()%1000), 0, 1000, 0, totalLength);
  }

  secondAngle() {
    return map(second(), 0, 60, 0, 360);
  }

  secondLength(totalLength) {
    return map(second(), 0, 60, 0, totalLength);
  }

  minuteAngle() {
    return map(minute(), 0, 60, 0, 360);
  }

  minuteLength(totalLength) {
    return map(minute(), 0, 60, 0, totalLength);
  }

  hour12Angle() {
    return map(hour()%12, 0, 12, 0, 360);
  }

  hour12Length(totalLength) {
    return map(hour()%12, 0, 12, 0, totalLength);
  }

  hour24Angle() {
    return map(hour(), 0, 24, 0, 360);
  }

  hour24Length(totalLength) {
    return map(hour(), 0, 24, 0, totalLength);
  }
}