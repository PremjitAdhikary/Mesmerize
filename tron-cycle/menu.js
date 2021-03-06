class Menu {

  constructor(color) {
    this._gameType = Game.GAMETYPE.ONE;
    this._gameDifficulty = Game.DIFFICULTY.EASY;
    this._control = Game.CONTROL.TOP_DOWN;
    this._audio = Game.AUDIO.ON;
    this._textColor = color.stringify();

    this.setupMainMenu();
    this.setupGameTypeSubMenu();
    this.setupGameDifficultySubMenu();
    this.setupControlSubMenu();
    this.setupAudioSubMenu();

    this._activeMenu = this._mainMenu;

    this._help = new Help(this._textColor, () => engine = this);
  }

  setupMainMenu() {
    this._mainMenu = [];
    this._mainMenu.push(
      new MenuItem('Play', true, 
      'Press Enter to Play the Game',  
      this._textColor,
      () => {
        engine = new Game(this._gameType, this._gameDifficulty, this._control, this._audio, 
          () => engine = this);
      })
    );
    this._gameTypeMenuItem = new MenuItem('Game Mode: '+this._gameType, false,
      'Press Enter to select Game Type', 
      this._textColor,
      () => {
        this._activeMenu = this._gameTypeSubMenu;
      });
    this._mainMenu.push(this._gameTypeMenuItem);
    this._gameDifficultyMenuItem = new MenuItem('Difficulty: '+this._gameDifficulty, false, 
      'Press Enter to select Game Difficulty',  
      this._textColor,
      () => {
        this._activeMenu = this._gameDifficultySubMenu;
      });
    this._mainMenu.push(this._gameDifficultyMenuItem);

    this._controlMenuItem = new MenuItem('Control: '+this._control, false,
      'Press Enter to select Control type for Cycle', 
      this._textColor,
      () => {
        this._activeMenu = this._controlSubMenu;
      });
    this._mainMenu.push(this._controlMenuItem);

    this._audioMenuItem = new MenuItem('Audio: '+this._audio, false,
      'Press Enter to toggle Audio', 
      this._textColor,
      () => {
        this._activeMenu = this._audioSubMenu;
      });
    this._mainMenu.push(this._audioMenuItem);

    this._mainMenu.push(
      new MenuItem('Help', false, 
      'Press Enter to know How to Play', 
      this._textColor,
      () => {
        engine = this._help;
      })
    );
  }

  setupGameTypeSubMenu() {
    let onselect = (type) => () => {
      this._gameType = type;
      this._gameTypeMenuItem._name = 'Game Mode: '+this._gameType;
      this._activeMenu = this._mainMenu;
    }
    let hintMsg = 'Press Enter to select this Game Mode and return to Main Menu';
    this._gameTypeSubMenu = [];
    this._gameTypeSubMenu.push(new MenuItem(
      Game.GAMETYPE.ONE, this._gameType === Game.GAMETYPE.ONE, hintMsg, this._textColor, 
      onselect(Game.GAMETYPE.ONE)
    ));
    this._gameTypeSubMenu.push(new MenuItem(
      Game.GAMETYPE.MANY, this._gameType === Game.GAMETYPE.MANY, hintMsg, this._textColor, 
      onselect(Game.GAMETYPE.MANY)
    ));
    this._gameTypeSubMenu.push(new MenuItem(
      Game.GAMETYPE.PHASER, this._gameType === Game.GAMETYPE.PHASER, hintMsg, this._textColor, 
      onselect(Game.GAMETYPE.PHASER)
    ));
    this._gameTypeSubMenu.push(new MenuItem(
      Game.GAMETYPE.RINZLER, this._gameType === Game.GAMETYPE.RINZLER, hintMsg, this._textColor, 
      onselect(Game.GAMETYPE.RINZLER)
    ));
  }

  setupGameDifficultySubMenu() {
    let onselect = (diff) => () => {
      this._gameDifficulty = diff;
      this._gameDifficultyMenuItem._name = 'Difficulty: '+this._gameDifficulty;
      this._activeMenu = this._mainMenu;
    }
    let hintMsg = 'Press Enter to select this Game Difficulty and return to Main Menu';
    this._gameDifficultySubMenu = [];
    this._gameDifficultySubMenu.push(new MenuItem(
      'Easy', this._gameDifficulty === Game.DIFFICULTY.EASY, hintMsg, this._textColor, 
      onselect(Game.DIFFICULTY.EASY)
    ));
    this._gameDifficultySubMenu.push(new MenuItem(
      'Normal', this._gameDifficulty === Game.DIFFICULTY.NORMAL, hintMsg, this._textColor, 
      onselect(Game.DIFFICULTY.NORMAL)
    ));
    this._gameDifficultySubMenu.push(new MenuItem(
      'Hard', this._gameDifficulty === Game.DIFFICULTY.HARD, hintMsg, this._textColor, 
      onselect(Game.DIFFICULTY.HARD)
    ));
  }

  setupControlSubMenu() {
    let onselect = (control) => () => {
      this._control = control;
      this._controlMenuItem._name = 'Control: '+this._control;
      this._activeMenu = this._mainMenu;
    }
    let hintMsg = 'Press Enter to select this Control and return to Main Menu';
    this._controlSubMenu = [];
    this._controlSubMenu.push(new MenuItem(
      Game.CONTROL.TOP_DOWN, this._control === Game.CONTROL.TOP_DOWN, hintMsg, this._textColor, 
      onselect(Game.CONTROL.TOP_DOWN)
    ));
    this._controlSubMenu.push(new MenuItem(
      Game.CONTROL.RIDER, this._control === Game.CONTROL.RIDER, hintMsg, this._textColor, 
      onselect(Game.CONTROL.RIDER)
    ));
  }

  setupAudioSubMenu() {
    let onselect = (audio) => () => {
      this._audio = audio;
      this._audioMenuItem._name = 'Audio: '+this._audio;
      this._activeMenu = this._mainMenu;
    }
    let hintMsg = 'Press Enter to select Audio Control and return to Main Menu';
    this._audioSubMenu = [];
    this._audioSubMenu.push(new MenuItem(
      Game.AUDIO.ON, this._audio === Game.AUDIO.ON, hintMsg, this._textColor, 
      onselect(Game.AUDIO.ON)
    ));
    this._audioSubMenu.push(new MenuItem(
      Game.AUDIO.OFF, this._audio === Game.AUDIO.OFF, hintMsg, this._textColor, 
      onselect(Game.AUDIO.OFF)
    ));
  }

  show() {
    this.showActiveMenu();
    this.showHint();
  }

  showActiveMenu() {
    let startY = height / 2 - (30 * this._activeMenu.length) / 2;
    for (let i=0; i<this._activeMenu.length; i++) {
      push();
      translate(width/2, startY + i*30);
      this._activeMenu[i].show();
      pop();
    }
  }

  showHint() {
    stroke(this._textColor);
    strokeWeight(1);
    fill(this._textColor);
    textSize(14);
    textFont('Courier New');
    let instruction = 'Use Up and Down Arrow Keys to move through the menu';
    let iWid = textWidth(instruction);
    text(instruction, width/2 - iWid/2, 440);
    let itemIndex = this.getSelectedActiveMenuItem();
    let hint = this._activeMenu[itemIndex]._hint;
    let hWid = textWidth(hint);
    text(hint, width/2 - hWid/2, 460);
  }

  input(keyCode) {
    let itemIndex = this.getSelectedActiveMenuItem();
    if (keyCode === UP_ARROW && itemIndex > 0) {
      this._activeMenu[itemIndex]._isHighlighted = false;
      this._activeMenu[itemIndex - 1]._isHighlighted = true;
    } else if (keyCode === DOWN_ARROW && itemIndex < this._activeMenu.length - 1) {
      this._activeMenu[itemIndex]._isHighlighted = false;
      this._activeMenu[itemIndex + 1]._isHighlighted = true;
    } else if (keyCode === ENTER) {
      this._activeMenu[itemIndex]._onSelect();
    }
  }

  inputOff() {}

  getSelectedMainMenuItem() {
    return this._mainMenu.findIndex(item => item._isHighlighted);
  }

  getSelectedActiveMenuItem() {
    return this._activeMenu.findIndex(item => item._isHighlighted);
  }
}

class MenuItem {
  constructor(name, isHighlighted, hint, color, onSelect) {
    this._name = name;
    this._isHighlighted = isHighlighted;
    this._hint = hint;
    this._onSelect = onSelect;
    this._textColor = color;
  }

  show() {
    stroke(this._textColor);
    strokeWeight(1);
    fill(this._textColor);
    textSize(25);
    textFont('Courier New');
    let nWid = textWidth(this._name);
    text(this._name, 0 - nWid/2, 0);
    if (this._isHighlighted)
      text('*', 0 - nWid/2 - 20, 0);
  }
}