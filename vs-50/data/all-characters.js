class AllCharacters {

  buildRam(params) {
    let ram = new HeroRam();
    this.buildCharacter(params, ram, AllCharacters.RAM);
    ram.stylizedArrow = params.stylizedArrow;
    return ram;
  }
  
  buildVanara(params) {
    return this.buildNpc(params, new NpcVanara(), AllCharacters.VANARA);
  }
  
  buildJambuvan(params) {
    return this.buildNpc(params, new NpcJambuvan(), AllCharacters.JAMBUVAN);
  }

  buildVali(params) {
    return this.buildNpc(params, new NpcVali(), AllCharacters.VALI);
  }

  buildNpc(params, npc, npcConfig) {
    this.buildCharacter(params, npc, npcConfig);
    npc.viewRange = npcConfig.viewRange * params.viewRangeMultiplier;
    npc.hero = params.hero;
    npc.overallInitiative = params.overallInitiative;
    npc.lifeColor = params.lifeColor;
    npc.effectColor = params.effectColor;
    return npc;
  }

  buildCharacter(params, gameCharacter, charConfig) {
    gameCharacter.x = params.x;
    gameCharacter.y = params.y;
    gameCharacter.cSprite = params.cSprite;
    gameCharacter.id = params.id;
    gameCharacter.gapDistance = charConfig.gapDistance;
    gameCharacter.speed = charConfig.speed;
    gameCharacter.chAttributes = new CharacterAttributes({
      maxLife: Math.ceil(charConfig.life * params.lifeMultiplier), 
      originalArmor: charConfig.armor, 
      armorMultiplier: params.armorMultiplier, 
      originalStrength: charConfig.strength, 
      strengthMultiplier: params.strengthMultiplier
    });
    for (let action of charConfig.actions) {
      gameCharacter.chAttributes.addAction(new ActionAttributes({
        name: action.name, 
        type: action.type, 
        minDamage: action.minDamage,
        maxDamage: action.maxDamage,
        range: action.range,
        initiative: action.initiative, 
        cooldown: action.cooldown
      }));
    }
    gameCharacter.registerIntervalRunners( () => gameCharacter.chAttributes.getAction(CHAR_PRIMARY_ATTACK).cool() );
    gameCharacter.registerIntervalRunners( () => gameCharacter.chAttributes.getAction(CHAR_SECONDARY_ATTACK).cool() );
    gameCharacter.regenerateInterval = charConfig.regenerateInterval;
    let regenerator = intervalCaller(() => gameCharacter.regenerateInterval, () => {
      gameCharacter.chAttributes.addLife(1);
      return true;
    });
    gameCharacter.registerIntervalRunners( () => regenerator() );
    return gameCharacter;
  }

}

AllCharacters.INSTANCE = (() => {
  let instance = new AllCharacters();
  return () => instance;
})();

AllCharacters.RAM = {
  life : 100, 
  regenerateInterval: 220, 
  strength : 5, 
  armor : 6, 
  speed: 4,
  gapDistance: 100,
  actions : [
    {
      type : CHAR_PRIMARY_ATTACK, 
      name : "Ek Teer", 
      minDamage: 5, 
      maxDamage: 8, 
      cooldown: (CharacterAnimator.SWITCH_FRAME_RATE*10)
    }, 
    {
      type : CHAR_SECONDARY_ATTACK, 
      name : "Anek Teer", 
      minDamage: 10, 
      maxDamage: 20, 
      cooldown: (CharacterAnimator.SWITCH_FRAME_RATE*30)
    }
  ]
};

AllCharacters.VANARA = {
  life : 40, 
  regenerateInterval: 1500, 
  strength : 3, 
  armor : 3, 
  speed: 6,
  viewRange: 500,
  gapDistance: 80,
  actions : [
    {
      type : CHAR_PRIMARY_ATTACK, 
      name : "Gada Pachaar", 
      minDamage: 4, 
      maxDamage: 6, 
      range: 95, 
      initiative: 70, 
      cooldown: (CharacterAnimator.SWITCH_FRAME_RATE*10)
    }, 
    {
      type : CHAR_SECONDARY_ATTACK, 
      name : "Chalaang Gada Pachaar", 
      minDamage: 6, 
      maxDamage: 10, 
      range: 115, 
      initiative: 60, 
      cooldown: (CharacterAnimator.SWITCH_FRAME_RATE*15)
    }
  ]
};

AllCharacters.JAMBUVAN = {
  life : 100, 
  regenerateInterval: 1500, 
  strength : 5, 
  armor : 4, 
  speed: 4,
  viewRange: 700,
  gapDistance: 70,
  actions : [
    {
      type : CHAR_PRIMARY_ATTACK, 
      name : "Nakh Vaar", 
      minDamage: 5, 
      maxDamage: 8, 
      range: 90, 
      initiative: 90, 
      cooldown: (CharacterAnimator.SWITCH_FRAME_RATE*10)
    }, 
    {
      type : CHAR_SECONDARY_ATTACK, 
      name : "Zor Takkar", 
      minDamage: 10, 
      maxDamage: 15, 
      range: 650, 
      initiative: 45, 
      cooldown: (CharacterAnimator.SWITCH_FRAME_RATE*20)
    }
  ]
};

AllCharacters.VALI = {
  life : 300, 
  regenerateInterval: 1000, 
  strength : 8, 
  armor : 6, 
  speed: 6,
  viewRange: 800,
  gapDistance: 90,
  actions : [
    {
      type : CHAR_PRIMARY_ATTACK, 
      name : "Gada Prahaar", 
      minDamage: 7, 
      maxDamage: 9, 
      range: 90, 
      initiative: 75, 
      cooldown: (CharacterAnimator.SWITCH_FRAME_RATE*16)
    }, 
    {
      type : CHAR_SECONDARY_ATTACK, 
      name : "Gada Ki Shor", 
      minDamage: 15, 
      maxDamage: 18, 
      range: 750, 
      initiative: 50, 
      cooldown: (CharacterAnimator.SWITCH_FRAME_RATE*120)
    }
  ]
};