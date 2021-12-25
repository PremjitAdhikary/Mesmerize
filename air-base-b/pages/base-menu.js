class BaseMenu {

  constructor() {
    this.mainMenu = [];
  }

  keyPressed() {
    switch(key) {
      case 'ArrowUp':
        menuScroll();
        this.activeItem = (this.activeItem-1+this.mainMenu.length) % this.mainMenu.length;
        this.updateMenu();
        break;
      case 'ArrowDown':
        menuScroll();
        this.activeItem = (this.activeItem+1) % this.mainMenu.length;
        this.updateMenu();
        break;
      case 'Enter':
        menuScroll();
        this.mainMenu[this.activeItem].onSelect();
        break;
    }
  }

  updateMenu() {
    this.mainMenu.forEach( item => item.isHighlighted = false );
    this.mainMenu[this.activeItem].isHighlighted = true;
  }

  draw(startY = 250, showInfo = true) {
    if (showInfo) {
      stroke(darkColor);
      strokeWeight(1);
      fill(darkColor);
      textSize(15);
      textFont(TEXT_FONT);
      let nWid = textWidth(BaseMenu.INFO_1);
      text(BaseMenu.INFO_1, width/2 - nWid/2, 450);
      nWid = textWidth(BaseMenu.INFO_2);
      text(BaseMenu.INFO_2, width/2 - nWid/2, 470);
    }
    
    for (let i = 0; i < this.mainMenu.length; i++) {
      push();
      translate(width/2, startY + i*30);
      this.mainMenu[i].show();
      pop();
    }
  }

}

BaseMenu.INFO_1 = "Use ↑ ↓ to move through the Menu.";
BaseMenu.INFO_2 = "Press Enter to select option."

class MenuItem {
  constructor(name, isHighlighted, onSelect) {
    this.name = name;
    this.isHighlighted = isHighlighted;
    this.onSelect = onSelect;
  }

  show() {
    let txtColor = this.isHighlighted ? darkColor : lineColor;
    stroke(txtColor);
    strokeWeight(1);
    fill(txtColor);
    textSize(25);
    textFont(TEXT_FONT);
    let nWid = textWidth(this.name);
    text(this.name, 0 - nWid/2, 0);
    if (this.isHighlighted)
      text('*', 0 - nWid/2 - 20, 0);
  }
}
