/**
 * Invoked by Hero to:
 * 
 * 1) Avoid colliding with NPCs
 * 
 * 2) Aim and Lock NPCs
 */
class HeroAssistAi {

  constructor(hero, npcs) {
    this.hero = hero;
    this.npcs = npcs;
  }

  executeCollisionAvoidance() {
    if (this.hero.state != CHAR_FORWARD) return;
    let npcsNearHero = this.npcs.filter( 
      npc => npc.state != CHAR_DEAD 
      && Math.abs(npc.x - this.hero.x) < (this.hero.gapDistance * 2) );
    for (let npc of npcsNearHero) {
      let npcCollBox = npc.getCollisionBox();
      if (collideRectRect(
          npcCollBox.x, npcCollBox.y, npcCollBox.w, npcCollBox.h, 
          this.hero.x - this.hero.cX, this.hero.y, this.hero.gapDistance, 20)) {
        eventBus.dispatch(this.hero.id, { action: CHAR_STOP });
        return;
      }
    }
  }

  executeFindAllNearestTargets() {
    return this.npcs.filter( 
      npc => npc.state != CHAR_DEAD 
      && Math.abs(npc.x - this.hero.x) < (width - GameCamera.OFFSET_X) );
  }

  executeFindNearestTarget() {
    let npcsNearHero = this.executeFindAllNearestTargets();
    if (npcsNearHero.length == 0) return null;
    return npcsNearHero.reduce( (a, b) => 
      (Math.abs(a.x - this.hero.x) < Math.abs(b.x - this.hero.x) ? a : b) );
  }

}