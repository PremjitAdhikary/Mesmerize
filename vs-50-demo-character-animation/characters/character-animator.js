class CharacterAnimator {

  constructor(character, sprite, data, defaultAnimation = "idle") {
    this.character = character;
    this.spriteImg = sprite;
    this.data = data;
    this.defaultAnimation = defaultAnimation;
    this.spriteLoaded = false;
    this.dataLoaded = false;
    this.showCollisionBox = false;
    this.collisionBoxColor = SketchColor.red().alpha50().stringify();
    this.isDebugOn = () => false;
    this.resetToDefault();
  }

  loadAnimationData(callback) {
    if (this.animationLoaded) return;
    this.processData(this.data);
    this.dataLoaded = true;
    this.setupFadeOutAnimation();
    this.spriteLoaded = true;
    callback();
  }

  processData(data) {
    this.frames = new Map();
    this.frameCollitionBoxes = new Map();
    for (let frame of data.frames) {
      this.frames.set(frame.name, createVector(frame.x, frame.y));
      this.frameCollitionBoxes.set(frame.name, {
        cx: frame.cx, cy: frame.cy, cw: frame.cw, ch: frame.ch
      });
    }
    this.animations = new Map();
    for (let animation of data.animations) {
      this.animations.set(animation.name, animation.frames);
    }
    this.fadeOutFrame = data.fade_out_frame;
  }

  setupFadeOutAnimation() {
    if (CharacterAnimator.GENERATED_FRAMES.hasCharacterAnimation(this.character, 'dieAnimation')) {
      return;
    }
    let fadeOut = [];
    let spritePos = this.frames.get(this.fadeOutFrame);
    for (let a of CharacterAnimator.FADE_OUT_ALPHA) {
      let fadedImg = this.spriteImg.get(spritePos.x, spritePos.y, 200, 150);
      fadeImage(fadedImg, a);
      fadeOut.push(fadedImg);
    }
    CharacterAnimator.GENERATED_FRAMES.addCharacterAnimation(
      this.character, 'dieAnimation', fadeOut);
  }

  set(animation, loop) {
    this.currentAnimation = animation;
    this.currentFrameIndex = 0;
    this.currSwitchFrame = 0;
    this.loop = loop;
  }

  setWithCallback(animation, callback) {
    this.currentAnimation = animation;
    this.currentFrameIndex = 0;
    this.currSwitchFrame = 0;
    this.loop = false;
    this.hasCallback = true;
    this.callback = callback;
  }

  resetToDefault() {
    this.fadeOutEnabled = false;
    this.set(this.defaultAnimation, true);
  }

  restartLoop() {
    this.currentFrameIndex = 0;
  }

  animate() {
    if (!this.animationLoaded) return;
    this.updateFrames();

    let continueCurrentAnimation = (this.fadeOutEnabled 
      || this.currentFrameIndex < this.animations.get(this.currentAnimation).length);
    if (continueCurrentAnimation) return;
    
    if (this.currentAnimation == 'die') {
      this.currentFrameIndex = 0;
      this.fadeOutEnabled = true;
      return;
    }
    
    if (this.loop) {
      this.restartLoop();
      return;
    }

    if (this.hasCallback) {
      this.hasCallback = false;
      this.callback();
      return;
    }

    this.resetToDefault();
  }

  updateFrames() {
    this.currSwitchFrame++;
    if (this.currSwitchFrame > CharacterAnimator.SWITCH_FRAME_RATE) {
      this.currSwitchFrame = 0;
      this.currentFrameIndex++;
    }
  }

  show(x, y) {
    if (!this.animationLoaded) return;
    if (this.fadeOutEnabled) {
      this.showFadeOutAnimation(x, y);
      return;
    }
    this.showSpriteAnimation(x, y);
    if (this.showCollisionBox || this.isDebugOn()) {
      noStroke();
      fill(this.collisionBoxColor);
      let collBox = this.getCollisionBox(x, y);
      rect(collBox.x, collBox.y, collBox.w, collBox.h);
    }
  }

  getCollisionBox(x, y) {
    let box = this.frameCollitionBoxes.get(
      this.animations.get(this.currentAnimation)[this.currentFrameIndex]);
    return { x: x - 200 + box.cx, y: y - 150 + box.cy, w: box.cw, h: box.ch };
  }

  showSpriteAnimation(x, y) {
    let spritePos = this.frames.get(
      this.animations.get(this.currentAnimation)[this.currentFrameIndex]);
    image(this.spriteImg.get(
      spritePos.x, spritePos.y, 200, 150), 
      x - 100, y - 75);
  }

  showFadeOutAnimation(x, y) {
    let fadeOut = 
      CharacterAnimator.GENERATED_FRAMES.getCharacterAnimation(this.character, 'dieAnimation');
    if (this.currentFrameIndex < fadeOut.length) {
      image(fadeOut[this.currentFrameIndex], x - 100, y - 75);
    } else if (this.hasCallback) {
      this.hasCallback = false;
      this.callback();
    }
  }

  get animationLoaded() {
    return this.dataLoaded && this.spriteLoaded;
  }
}

CharacterAnimator.SWITCH_FRAME_RATE = 4;
CharacterAnimator.FADE_OUT_ALPHA = [240, 220, 190, 150, 0];

class GeneratedFrames {
  constructor() {
    this.charGeneratedFramesMap = new Map();
  }
  hasCharacter(character) {
    return this.charGeneratedFramesMap.has(character)
  }
  hasCharacterAnimation(character, animation) {
    return this.hasCharacter(character) && this.charGeneratedFramesMap.get(character).has(animation);
  }
  addCharacterAnimation(character, animation, frames) {
    if (!this.hasCharacter(character)) {
      this.charGeneratedFramesMap.set(character, new Map());
    }
    this.charGeneratedFramesMap.get(character).set(animation, frames);
  }
  getCharacterAnimation(character, animation) {
    if (this.hasCharacter(character)) {
      return this.charGeneratedFramesMap.get(character).get(animation);
    }
    return undefined;
  }
  clear() {
    this.charGeneratedFramesMap.clear();
  }
}

CharacterAnimator.GENERATED_FRAMES = new GeneratedFrames();