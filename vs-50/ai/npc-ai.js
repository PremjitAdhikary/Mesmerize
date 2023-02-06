/**
 * AI which defines behavior for NPCs
 * 
 * 1) AvoidCollision: So that characters dont collide and group together at 1 place
 * 
 * 2) Reposition: In case character goes out of screen, reposition
 * 
 * 3) ChaseHero
 * 
 * 4) ExecutePrimaryAttack
 * 
 * 5) ExecuteSecondaryAttack
 */
class NpcAi {

  constructor(hero, npcs, maxNpcsToEngageHero = 2) {
    this.hero = hero;
    this.npcs = npcs;
    this.avoidCollision = new AvoidCollision(this.npcs);
    this.reposition = new Reposition();
    this.availableActions = [
      new ExecutePrimaryAttack(), 
      new ExecuteSecondaryAttack(), 
      new ChaseHero()
    ];
    this.maxNpcsToEngageHero = maxNpcsToEngageHero;
  }

  executeFor(npc) {
    this.avoidCollisionBetweenHeroAnd(npc);
    this.checkAndReposition(npc);
    if (npc.aiExecuted) return;
    npc.aiExecuted = true;
    if (this.heroNotEngagedBy(npc)) return;
    for (let action of this.availableActions) {
      if (this.npcExecutesAction(npc, action)) {
        npc.heroEngaged = true;
        return;
      }
    }
  }

  avoidCollisionBetweenHeroAnd(npc) {
    this.avoidCollision.execute(this.hero, npc);
  }

  checkAndReposition(npc) {
    this.reposition.execute(this.hero, npc);
  }

  heroNotEngagedBy(npc) {
    return (!npc.heroEngaged && this.heroCannotHandleMoreNpcs()) || this.noActionToBeTakenBy(npc);
  }

  heroCannotHandleMoreNpcs() {
    return this.npcs.filter(n => n.active && n.heroEngaged).length >= this.maxNpcsToEngageHero; 
  }

  noActionToBeTakenBy(npc) {
    return !NpcAi.isSuccess(npc.overallInitiative);
  }

  npcExecutesAction(npc, action) {
    return action.execute(this.hero, npc);
  }

}

NpcAi.isSuccess = chance => random(100) < chance;

class BaseExecutor {

  constructor(criteria) {
    this.criteria = criteria;
  }

  execute(hero, npc) {
    if (!this.criteria(hero, npc)) 
      return false;
    return this.executeAi(hero, npc);
  }

  executeAi(hero, npc) { return true; } // to override

}

class ChaseHero extends BaseExecutor {

  constructor() {
    super(
      (hero, npc) => npc.state == CHAR_IDLE && hero.active && hero.state != CHAR_DEAD  
      && 
      (npc.heroEngaged || (Math.abs(npc.x - hero.x) < (npc.viewRange * 2)))
    );
  }

  executeAi(hero, npc) {
    let heroCollBox = hero.getCollisionBox();
    let heroInViewRange = collideRectRect(
      heroCollBox.x, heroCollBox.y, heroCollBox.w, heroCollBox.h, 
      npc.x - npc.cX - npc.viewRange, npc.y, npc.viewRange, 20);
    let heroTooClose = collideRectRect(
      heroCollBox.x, heroCollBox.y, heroCollBox.w, heroCollBox.h, 
      npc.x - npc.cX - npc.gapDistance, npc.y, npc.gapDistance, 20);
    if ((npc.heroEngaged || heroInViewRange) && !heroTooClose) {
      eventBus.dispatch(npc.id, { action: CHAR_FORWARD });
      return true;
    }
    return false;
  }

}

class AvoidCollision extends BaseExecutor {

  constructor(npcs) {
    super(
      (hero, npc) => npc.state == CHAR_FORWARD && hero.active && hero.state != CHAR_DEAD  
      && (Math.abs(npc.x - hero.x) < (npc.viewRange * 2))
    );
    this.npcs = npcs;
  }

  executeAi(hero, npc) {
    if (npc.x > hero.x + npc.gapDistance + 10) return true;
    if (this.checkCharacterCollision(npc, hero, npc.gapDistance)) return true;

    for (let anotherNpc of this.npcs) {
      if (anotherNpc.state == CHAR_DEAD || anotherNpc == npc || !anotherNpc.heroEngaged) continue;
      if (this.checkCharacterCollision(npc, anotherNpc, Math.ceil(npc.gapDistance/20))) 
        return true;
    }
    return false;
  }

  checkCharacterCollision(npc, character, gapDistance) {
    let characterCollBox = character.getCollisionBox();
    let characterTooClose = collideRectRect(
      characterCollBox.x, characterCollBox.y, characterCollBox.w, characterCollBox.h, 
      npc.x - npc.cX - gapDistance, npc.y, gapDistance, 20);
    if (characterTooClose) {
      eventBus.dispatch(npc.id, { action: CHAR_STOP });
      return true;
    }
  }

}

class Reposition extends BaseExecutor {

  constructor() {
    super(
      (hero, npc) => hero.active && hero.state != CHAR_DEAD 
      && (hero.x > npc.x && !npc.onScreen())
    );
  }

  executeAi(hero, npc) {
    npc.x = hero.x + 2 * width;
    return true;
  }

}

class AttackHero extends BaseExecutor {

  constructor(attackType, executeAttack) {
    super(
      (hero, npc) => npc.state == CHAR_IDLE && hero.active && hero.state != CHAR_DEAD  
      && !npc.chAttributes.getAction(attackType).executed 
      && (Math.abs(npc.x - hero.x) < (npc.chAttributes.getAction(attackType).range * 2))
    );
    this.attackType = attackType;
    this.executeAttack = executeAttack;
  }

  executeAi(hero, npc) {
    let heroCollBox = hero.getCollisionBox();
    let heroInAttackRange = collideRectRect(
      heroCollBox.x, heroCollBox.y, heroCollBox.w, heroCollBox.h, 
      npc.x - npc.cX - npc.chAttributes.getAction(this.attackType).range, 
      npc.y, npc.chAttributes.getAction(this.attackType).range, 20);

    if (heroInAttackRange && NpcAi.isSuccess(npc.chAttributes.getAction(this.attackType).initiative)) {
      this.executeAttack(npc);
      return true;
    }
    return false;
  }

}

class ExecutePrimaryAttack extends AttackHero {

  constructor() {
    super(CHAR_PRIMARY_ATTACK, npc => eventBus.dispatch(npc.id, { action: CHAR_PRIMARY_ATTACK }));
  }

}

class ExecuteSecondaryAttack extends AttackHero {

  constructor() {
    super(CHAR_SECONDARY_ATTACK, npc => eventBus.dispatch(npc.id, { action: CHAR_SECONDARY_ATTACK }));
  }

}