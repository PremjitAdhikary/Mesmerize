/**
 * Along with properties for base character, for NPCs there are some addtional ones. These are:
 * - hero: so the hero can be engaged
 * - viewRange: the view range of npc to spot the hero
 * - overallInitiative: determines the proactiveness of npc
 * - lifeColor: color of the life bar
 * - effectColor: color for any animation effects
 */
class NpcCharacter extends BaseVs50Character {

  constructor(character, npcJSON) {
    super({
      character, 
      direction: BaseCharacter.DIRECTION_LEFT, 
      initialState: CHAR_IDLE
    });
    this.cJSON = npcJSON;
    this.viewRangeColor = SketchColor.blue().alpha(0.25).stringify();
    this.effectColor = SketchColor.black();
    this.aiExecuted = false;
    this.heroEngaged = false;
    this.aiExecutorInterval = intervalCaller(() => 60, () => {
      if (!this.aiExecuted) return false;
      this.aiExecuted = false;
      return true; // ai has been executed just now, start countdown timer
    });
    this.registerIntervalRunners(() => this.aiExecutorInterval());
  }

  load() {
    super.load();
    this.actionMap.set(CHAR_PRIMARY_ATTACK, () => this.primaryAction());
    this.actionMap.set(CHAR_SECONDARY_ATTACK, () => this.secondaryAction());
  }

  animate() {
    if (!this.active || !this.onScreen()) return;
    super.animate();
  }

  onScreen() {
    return this.x > this.cX && this.x < this.cX + (width * 1.5);
  }

  show() {
    if (!this.active || !this.onScreen()) return;
    this.anim.show(this.x - this.cX, this.y);
    this.showDebug();
    this.showLife();
  }

  showDebug() {
    if (!debug) return;
    noStroke();
    fill(this.gapDistanceColor);
    rect(this.x - this.cX - this.gapDistance, this.y, this.gapDistance, 20);
    fill(this.viewRangeColor);
    rect(this.x - this.cX - this.viewRange, this.y - 30, this.viewRange, 30);
  }

  showLife() {
    stroke(this.lifeColor);
    strokeWeight(1);
    noFill();
    rect(this.x - this.cX - 10, this.y - 50, 20, 5);
    fill(this.lifeColor);
    let lifeWidth = map(this.chAttributes.currentLife, 0, this.chAttributes.maxLife, 0, 20);
    rect(this.x - this.cX - 10, this.y - 50, lifeWidth, 5);
  }

  damage(amount) {
    this.heroEngaged = true;
    super.damage(amount);
  }

}