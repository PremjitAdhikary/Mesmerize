class MainMenu {
  constructor() {
    this.classic = new BasicButton(width/2, height/2 - 60, 200, 40, 'Start Classic Game', 20);
    this.mini = new BasicButton(width/2, height/2, 200, 40, 'Start Mini Game', 20);
    this.salvo = new BasicButton(width/2, height/2 + 60, 200, 40, 'Start Salvo Game', 20);
    this.easy = new BasicButton(width/2 - 50, height - 30, 80, 30, 'Easy', 12);
    this.normal = new BasicButton(width/2 + 50, height - 30, 80, 30, 'Normal', 12);
    this.difficulty = 1;
    this.easy.enabled = false;
  }
  show() {
    this.classic.show();
    this.mini.show();
    this.salvo.show();
    this.easy.show();
    this.normal.show();
    let txt = 'Enemy Difficulty: ' + (this.difficulty == 1 ? 'Easy' : 'Normal');
    textSize(15);
    let txtWd = textWidth(txt);
    stroke(txtColor);
    fill(txtColor);
    text(txt, width/2 - txtWd/2, height - 60);
    textSize(25);
    txt = 'Play Battleship';
    txtWd = textWidth(txt);
    stroke(txtColor);
    fill(txtColor);
    text(txt, width/2 - txtWd/2, height/2 - 120);
  }

  eventAt(x, y) {
    if (this.classic.isClicked(x, y)) {
      bus.dispatch("ControlEInCl", { difficulty: (this.difficulty == 1 ? 'Easy' : 'Normal') });
    } else if (this.mini.isClicked(x, y)) {
      bus.dispatch("ControlEInMi", { difficulty: (this.difficulty == 1 ? 'Easy' : 'Normal') });
    } else if (this.salvo.isClicked(x, y)) {
      bus.dispatch("ControlEInSl", { difficulty: (this.difficulty == 1 ? 'Easy' : 'Normal') });
    } else if (this.easy.isClicked(x, y)) {
      this.easy.enabled = false;
      this.normal.enabled = true;
      this.difficulty = 1;
    } else if (this.normal.isClicked(x, y)) {
      this.easy.enabled = true;
      this.normal.enabled = false;
      this.difficulty = 2;
    }
  }
}