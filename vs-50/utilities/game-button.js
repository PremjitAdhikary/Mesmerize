/**
 * show()
 * hide()
 * enable()
 * disable()
 * selected()
 * deselected()
 * hilight()
 * mouseClicked()
 * 
 * config {
 *   bgColor, hilightColor, hilightBgColor
 *   x, y, width, height, 
 *   txt, txtFont, txtSize, txtColor
 * }
 */
class GameButton {

  constructor(config) {
    this.config = config;
    this.hasText = config.txt != null;
    this.visibility = true;
    this.enabled = true;
    if (this.hasText) {
      textFont(config.txtFont);
      textSize(config.txtSize);
      this.txtWd = textWidth(config.txt);
    }
  }

  show() { this.visibility = true; }
  hide() { this.visibility = false; }
  enable() { this.enabled = true; }
  disable() { this.enabled = false; }
  selected() { this.hilight = true; }
  deselected() { this.hilight = false; }

  draw() {
    if (!this.visibility) return;
    noStroke();
    fill(this.config.bgColor);
    rect(this.config.x, this.config.y, this.config.width, this.config.height, 20);
    this.drawHilight();
    this.drawText();
  }

  mouseClicked() {
    if (!this.visibility || !this.enabled || !this.isClicked(mouseX, mouseY)) return;
    if (this.onClick) {
      this.onClick();
    } else {
      console.log('no method')
    }
  }

  isClicked(x, y) {
    return x > this.config.x && x < (this.config.x + this.config.width) 
      && y > this.config.y && y < (this.config.y + this.config.height);
  }

  drawText() {
    if (!this.hasText) return;
    textFont(this.config.txtFont);
    textSize(this.config.txtSize);
    fill(this.config.txtColor);
    strokeWeight(0);
    text(this.config.txt, 
      this.config.x + this.config.width/2 - this.txtWd/2, 
      this.config.y + this.config.height/2 + 10);
  }

  drawHilight() {
    if (!this.hilight) return;
    if (this.config.hilightBgColor) {
      noStroke();
      fill(this.config.hilightBgColor);
      rect(this.config.x, this.config.y, this.config.width, this.config.height, 20);
    }
    stroke(this.config.hilightColor);
    strokeWeight(5);
    noFill();
    rect(this.config.x, this.config.y, this.config.width, this.config.height, 20);
  }

}