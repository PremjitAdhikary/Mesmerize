class FightInfo {

  constructor(champion, challenger, totalBeats) {
    this._champion = {};
    this._champion.life = {};
    if (this.hasSupportAttribute(champion)) {
      this._champion.support = {};
    }
    this.updateChampion(champion);
    this._champion.life.shadow = this._champion.life.current;
    if (this._champion.support) {
      this._champion.support.shadow = this._champion.support.current;
    }
    this.clearChampionMove();
    
    this._challenger = {};
    this._challenger.life = {};
    if (this.hasSupportAttribute(challenger)) {
      this._challenger.support = {};
    }
    this.updateChallenger(challenger);
    this._challenger.life.shadow = this._challenger.life.current;
    if (this._challenger.support) {
      this._challenger.support.shadow = this._challenger.support.current;
    }
    this.clearChallengerMove();

    this._lifeLength = 250;
    this._lifeHeight = 20;
    this._supportLength = 100;
    this._supportHeight = 5;
    this._offset = 50;
    this._totalBeats = totalBeats;
  }

  updateBeat(beatCount) {
    this._currentBeat = beatCount;
  }

  hasSupportAttribute(fighter) {
    return fighter._stamina || fighter._mojo || fighter._mana;
  }

  getSupportAttributes(fighter) {
    if (fighter._stamina) {
      return {
        net: fighter._stamina,
        current: fighter._currentStamina
      };
    }
    if (fighter._mojo) {
      return {
        net: fighter._mojo,
        current: fighter._currentMojo
      };
    }
    if (fighter._mana) {
      return {
        net: fighter._mana,
        current: fighter._currentMana
      };
    }
  }

  updateChampion(champion) {
    this.updateFighter(this._champion, champion);
  }

  updateChallenger(challenger) {
    this.updateFighter(this._challenger, challenger);
  }

  updateFighter(fighter, fighterInfo) {
    fighter.name = this.extractFighterName(fighterInfo);
    fighter.life.net = fighterInfo._life;
    fighter.life.current = fighterInfo._currentLife;
    if (fighter.support) {
      let support = this.getSupportAttributes(fighterInfo);
      fighter.support.net = support.net;
      fighter.support.current = support.current;
    }
  }

  setChampionMove(move) {
    this._champion.move = move;
  }

  setChallengerMove(move) {
    this._challenger.move = move;
  }

  clearChampionMove() {
    this._champion.move = '';
  }

  clearChallengerMove() {
    this._challenger.move = '';
  }

  extractFighterName(fighterInfo) {
    let fighterTypes = ['Amateur', 'Professional', 'Mage', 'Hero'];
    return fighterTypes.includes(fighterInfo._type) ? fighterInfo._subtype : fighterInfo._type;
  }

  show() {
    stroke(0);
    this.renderNames();
    this.renderChampionLife();
    this.renderChampionSupport();
    this.renderChallengerLife();
    this.renderChallengerSupport();
    this.renderTime();
    this.renderMoves();
  }

  renderNames() {
    noFill();
    text(this._challenger.name, width/2+this._offset, 50);
    let champNameWidth = textWidth(this._champion.name);
    text(this._champion.name, width/2-this._offset-champNameWidth, 50);
  }

  renderMoves() {
    noFill();
    text(this._challenger.move, width/2+this._offset, 110);
    let champMoveWidth = textWidth(this._champion.move);
    text(this._champion.move, width/2-this._offset-champMoveWidth, 110);
  }

  renderChampionLife() {
    noFill();
    rect(width/2-this._offset-this._lifeLength, 60, this._lifeLength, this._lifeHeight);

    fill(0);
    let championLifeShadowLength = map(this._champion.life.shadow, 0, this._champion.life.net, 
      0, this._lifeLength);
    rect(width/2-this._offset-championLifeShadowLength, 60, championLifeShadowLength, 
      this._lifeHeight);

    this.calculateVariableAttribute(this._champion.life);
  }

  renderChallengerLife() {
    noFill();
    rect(width/2+this._offset, 60, this._lifeLength, this._lifeHeight);

    fill(0);
    let challengerLifeShadowLength = map(this._challenger.life.shadow, 0, this._challenger.life.net, 
      0, this._lifeLength);
    rect(width/2+this._offset, 60, challengerLifeShadowLength, this._lifeHeight);

    this.calculateVariableAttribute(this._challenger.life);
  }

  renderChampionSupport() {
    if (!this._champion.support) return;
    noFill();
    rect(width/2-this._offset-this._supportLength, 90, this._supportLength, this._supportHeight);

    fill(0);
    let championSupportShadowLength = map(this._champion.support.shadow, 0, 
      this._champion.support.net, 0, this._supportLength);
    rect(width/2-this._offset-championSupportShadowLength, 90, championSupportShadowLength, 
      this._supportHeight);

    this.calculateVariableAttribute(this._champion.support);
  }

  renderChallengerSupport() {
    if (!this._challenger.support) return;
    noFill();
    rect(width/2+this._offset, 90, this._supportLength, this._supportHeight);

    fill(0);
    let challengerSupportShadowLength = map(this._challenger.support.shadow, 0, 
      this._challenger.support.net, 0, this._supportLength);
    rect(width/2+this._offset, 90, challengerSupportShadowLength, this._supportHeight);

    this.calculateVariableAttribute(this._challenger.support);
  }

  calculateVariableAttribute(attribute) {
    let delta = 0;
    if (attribute.shadow > attribute.current) {
      delta = Math.max(
        attribute.net*0.1, 
        (attribute.shadow - attribute.current)/5);
      delta = -Math.min(delta, (attribute.shadow - attribute.current));
    } else if (attribute.shadow < attribute.current) {
      delta = Math.max(
        attribute.net*0.1, 
        (attribute.current - attribute.shadow)/5);
      delta = Math.min(delta, (attribute.current - attribute.shadow));
    }
    attribute.shadow += delta;
    attribute.shadow = Math.max(0, attribute.shadow);
    attribute.shadow = Math.min(attribute.net, attribute.shadow);
  }

  renderTime() {
    noFill();
    circle(width/2, 70, this._offset*1.5);
    fill(0);
    if (!this._currentBeat) {
      circle(width/2, 70, this._offset*1.5);
    } else {
      let timeAngle = map(this._currentBeat, 0, this._totalBeats, 0, TWO_PI);
      if (this._currentBeat != this._totalBeats) {
        arc(width/2, 70, this._offset*1.5, this._offset*1.5, -HALF_PI+timeAngle, TWO_PI-HALF_PI);
      }
    }
  }
}