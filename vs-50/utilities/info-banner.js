/**
 * InfoBanner drops a banner from the top of the screen with heading and info.
 * Two types of banner.
 * 1) Non-interactive: Banner comes down, displays info for certain time and then goes off.
 * To generate one: new InfoBanner('the heading', ['testing', 'ram game here'], font, 400))
 * This drops the banner for 400 frames and then goes up.
 * 2) Interactive: Banner comes down, displays info and persists. Till the banner is called off 
 * by some trigger or event.
 * 
 * The Banner has 3 states
 * - STATE_DOWN: when it comes down
 * - STATE_STAY: descent complete, display info
 * - STATE_UP: goes up
 * 
 * callOnBannerInPosition(callback): Add a callback to invoke once the banner has completed 
 * descent and in position. For interactive banners, this can be activating a button that the 
 * user can click to remove the banner
 * 
 * callOnBannerOut(callback): Add a callback to invoke once the banner has completed ascent. 
 * This can be moving to another page, or triggering another event
 * 
 * removeBanner(): Triggers the removal of banner (starts the ascent)
 */
class InfoBanner {

  constructor(heading, lines, infoFont, numOfFrames) {
    this.heading = heading;
    if (numOfFrames) {
      this.numOfFrames = numOfFrames;
      this.persistent = false;
    } else {
      this.persistent = true;
    }
    this.infoFont = infoFont;
    this.active = true;
    this.state = InfoBanner.STATE_DOWN;
    this.calculateDimensions(lines);
    this.rectColor = SketchColor.white().alpha50().stringify();
    this.txtColor = 0;
  }

  calculateDimensions(lines) {
    this.lines = [];
    textSize(FONT_NORMAL_SIZE);
    textFont(this.infoFont);
    this.lines = lines.map(line => {return { txt: line, wd: textWidth(line) }});
    let maxWidth = this.lines.map(line => textWidth(line.txt)).reduce((a,b) => Math.max(a,b), 0);
    textSize(FONT_HEADING_SIZE);
    maxWidth = Math.max(maxWidth, textWidth(this.heading));
    this.totalWidth = maxWidth + 100;
    this.totalHeight = this.lines.length * FONT_NORMAL_HT + (FONT_NORMAL_HT + FONT_HEADING_HT) * 2;
    this.initialY = -(this.totalHeight + 10);
    this.baseY = this.initialY;
  }

  updateCX() { }

  animate() {
    if (!this.active) return;
    switch(this.state) {
      case InfoBanner.STATE_DOWN:
        this.animateStateDown();
        break;
      case InfoBanner.STATE_STAY:
        this.animateStateStay();
        break;
      case InfoBanner.STATE_UP: 
        this.animateStateUp();
        break;
    }
  }

  animateStateDown() {
    this.baseY += 10;
    if (this.baseY > 30) {
      if (this.callbackInPosition) {
        this.callbackInPosition();
      }
      this.state = InfoBanner.STATE_STAY;
    }
    return;
  }

  animateStateStay() {
    if (this.persistent) return;
    this.numOfFrames--;
    if (this.numOfFrames < 0) this.state = InfoBanner.STATE_UP;
    return;
  }

  animateStateUp() {
    this.baseY -= 10;
    if (this.baseY < this.initialY) {
      this.active = false;
      if (this.callbackOnDeactivate) {
        this.callbackOnDeactivate();
      }
    }
    return;
  }

  show() {
    if (!this.active) return;
    noStroke();
    fill(this.rectColor);
    rect(width/2 - this.totalWidth/2, this.baseY, this.totalWidth, this.totalHeight, 20);
    stroke(this.txtColor);
    fill(this.txtColor);
    strokeWeight(0);
    textFont(this.infoFont);
    textSize(FONT_HEADING_SIZE);
    let lineY = this.baseY + 15 + FONT_HEADING_HT;
    text(this.heading, width/2 - textWidth(this.heading)/2, lineY);
    lineY += (FONT_HEADING_HT + FONT_NORMAL_HT);
    textSize(FONT_NORMAL_SIZE);
    this.lines.forEach(line => {
      text(line.txt, width/2 - line.wd/2, lineY);
      lineY += FONT_NORMAL_HT;
    });
  }

  removeBanner() {
    this.state = InfoBanner.STATE_UP;
  }

  callOnBannerInPosition(callback) {
    this.callbackInPosition = callback;
  }

  callOnBannerOut(callback) {
    this.callbackOnDeactivate = callback;
  }

}

InfoBanner.STATE_DOWN = 0;
InfoBanner.STATE_STAY = 1;
InfoBanner.STATE_UP = 2;