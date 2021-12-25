class PauseScreen extends BaseMenu {

  setup() {
    this.mainMenu.push(
      new MenuItem('Resume', true, 
      () => {
        if (bgSoundOn && this.sceneArgs.song) this.sceneArgs.song.loVolume();
        manager.showScene( this.sceneArgs.backTo, {
          animate: true, reset: false
        } );
      })
    );
    this.mainMenu.push(
      new MenuItem('End Game', false, 
      () => {
        if (bgSoundOn && this.sceneArgs.song) this.sceneArgs.song.loVolume();
        manager.showScene( this.sceneArgs.backTo, {
          animate: false, reset: false, endGame: true
        } );
      })
    );
  }

  enter() {
    this.activeItem = 0;
    this.updateMenu();
    if (bgSoundOn && this.sceneArgs.song) this.sceneArgs.song.hiVolume();
  }

  draw() {
    manager.findScene( this.sceneArgs.backTo ).oScene.draw();
    drawModal();
    super.draw();
    this.drawTitle();
  }

  drawTitle() {
    let title = 'Game Paused';
    stroke(darkColor);
    strokeWeight(2);
    fill(darkColor);
    textSize(30);
    textFont(TEXT_FONT);
    let nWid = textWidth(title);
    text(title, width/2 - nWid/2, 100);
  }

}