class Fighter {

  constructor(info, x, y, isChamp) {
    this._name = info['Fighter Name'];
    this._type = info['Fighter Type'];
    this._subtype = info['Fighter Subtype'];
    this.update(info);

    this._x = x;
    this._y = y;
    this._isChamp = isChamp;
    this._size = 256;
    this._dataLoaded = false;
    this._spriteLoaded = false;
    this._animate;
  }

  extractRecourceName() {
    let fighterTypes = ['Amateur', 'Professional', 'Mage', 'Hero'];
    return fighterTypes.includes(this._type) ? this._subtype : this._type;
  }

  loadAnimationData(callback) {
    if (this._dataLoaded) return;
    
    let me = this;
    let dataJsonPath = './animation-data/'+me.extractRecourceName()+'-data.json';
    let dataImgPath = './img/'+me.extractRecourceName()+(me._isChamp?'-champ':'-challenger')+'-SpriteSheet.png';
    let dummyJsonPath = './animation-data/Dummy-data.json';
    let dummyImgPath = './img/'+(me._isChamp?'Dummy-champ':'Dummy-challenger')+'-SpriteSheet.png';

    let loadedSpriteImage = () => {
      me._spriteLoaded = true;
      me.animateDefault();
      callback();
    };

    let loadSpriteImage = (imgPath) => {
      me._spriteImg = loadImage(
        imgPath,
        () => loadedSpriteImage()
      );
    };

    let loadedJsonData = (d, imgPath) => {
      me.processData(d);
      me._dataLoaded = true;
      loadSpriteImage(imgPath);
    }

    let dataCallback = d => {
      loadedJsonData(d, dataImgPath);
    };

    let dummyDataCallback = d => {
      loadedJsonData(d, dummyImgPath);
    };
    
    let dataErrorCallback = () => {
      loadJSON(dummyJsonPath, dummyDataCallback, e => console.log(e));
    };
    loadJSON(dataJsonPath, dataCallback, dataErrorCallback);
  }

  processData(data) {
    this._spriteData = {};
    for (let frame of data.frames) {
      this._spriteData[frame.name] = frame.anim;
    }
  }

  same(fighter) {
    return (
      this._name == fighter['Fighter Name'] 
      && this._type == fighter['Fighter Type'] 
      && this._subtype == fighter['Fighter Subtype']
    );
  }

  update(fighter) {
    this._life = fighter['Life'];
    this._currentLife = fighter['Current Life'];
    this._strength = fighter['Strength'];
    this._dexterity = fighter['Dexterity'];
    if (fighter['Stamina']) {
      this._stamina = fighter['Stamina'];
      this._currentStamina = fighter['Current Stamina'];
    }
    if (fighter['Mojo']) {
      this._mojo = fighter['Mojo'];
      this._currentMojo = fighter['Current Mojo'];
    }
    if (fighter['Mana']) {
      this._mana = fighter['Mana'];
      this._currentMana = fighter['Current Mana'];
    }
  }

  createTextAnimate(name, callback, runFrames) {
    return {
      name,
      frames: runFrames,
      currentFrame: 0,
      runFrames: runFrames,
      callback
    };
  }

  createAnimate(name, callback, runFrames) {
    return {
      name,
      frames: this._spriteData[name].length,
      currentFrame: 0,
      runFrames: runFrames ? runFrames : this._spriteData[name].length,
      callback
    };
  }

  animateDefault() {
    let me = this;
    this._animate = this.createAnimate(
      'Default', 
      () => me._currentLife > 0 ? me.animateDefault() : me.ko());
  }

  action(event, hit) {
    if (!event) return 0;
    let me = this;
    let callback = () => me.animateDefault();

    if (!this._dataLoaded || !this._spriteData 
        || !this._spriteData[event['Name']+(hit?'-Hit':'-Miss')]) {
      let f = Math.floor(random(4,8));
      this._animate = this.createTextAnimate(event['Name'], callback, f);
    } else {
      this._animate = this.createAnimate(event['Name']+(hit?'-Hit':'-Miss'), callback);
    }
    return this._animate.frames;
  }

  reaction(event, frames, hit) {
    let me = this;
    let callbackDefault = () => me.animateDefault();

    if (!event) {
      this._animate = this.createAnimate('Default', callbackDefault, frames);
      return frames;
    }
    
    if (!this._dataLoaded || !this._spriteData 
        || !this._spriteData[event['Name']+(hit?'-Hit':'-Miss')]) {
      this._animate = this.createTextAnimate(event['Name'], callbackDefault, frames);
    } else {
      let reactAnimationName = event['Name']+(hit?'-Hit':'-Miss');
      let animateBack = () => {
        me._animate = me.createAnimate(reactAnimationName+'-Back', callbackDefault);
      };
      this._animate = this.createAnimate(reactAnimationName, animateBack, 
        frames-this._spriteData[reactAnimationName+'-Back'].length);
    }
    return frames;
  }

  ko() {
    let me = this;
    let callback = () => me.createAnimate('KO', callback);
    this._animate = this.createAnimate('KO-Fall', callback);
  }

  show() {
    stroke(0);
    noFill();
    if (!this._spriteLoaded) {
      rect(this._x, this._y, this._size*2, this._size);
      text(this._currentLife, this._x+10+(this._isChamp?0:128), this._y+10);
    }

    if (this._animate) {
      if (!this._spriteLoaded || !this._spriteData[this._animate.name]) {
        text(this._animate.name, this._x+10+(this._isChamp?0:128), this._y+30);
      } else {
        let pickFrame = Math.min(this._animate.currentFrame, 
          this._spriteData[this._animate.name].length-1);
        let imgx = this._spriteData[this._animate.name][pickFrame].x*this._size*2;
        let imgy = this._spriteData[this._animate.name][pickFrame].y*this._size;
        let img = this._spriteImg.get(imgx, imgy, (this._size*2), this._size);
        image(img, this._x, this._y);
      }
      this._animate.currentFrame++;
      if (this._animate.currentFrame == this._animate.runFrames) {
        this._animate.callback();
      }
    }
  }
}