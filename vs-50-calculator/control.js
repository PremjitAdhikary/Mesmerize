let choice_difficulty = 1;
let choice_blessings = 1;
let choice_action = 1;
let choice_enemy = 1;

let difficulty = ['easy', 'normal', 'hard'];

document.getElementById('choice_difficulty').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    choice_difficulty = val;
    update();
  }
};

document.getElementById('choice_blessings').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    choice_blessings = val;
    update();
  }
};

document.getElementById('choice_action').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    choice_action = val;
    update();
  }
};

document.getElementById('choice_enemy').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    choice_enemy = val;
    update();
  }
};

function getEnemy() {
  let enemies = [AllCharacters.VANARA, AllCharacters.JAMBUVAN, AllCharacters.VALI];
  return enemies[choice_enemy-1];
}

function getEnemyName() {
  switch(choice_enemy) {
    case 1: return 'Vanara';
    case 2: return 'Jambuvan';
    case 3: return 'Vali';
  }
}

function updateHeroStats() {console.log(AllCharacters.VALI);
  document.getElementById('hero_name').innerHTML = 'Ram';
  document.getElementById('hero_life').innerHTML = AllCharacters.RAM.life;
  document.getElementById('hero_strength').innerHTML = AllCharacters.RAM.strength * getAttackerStrengthMultiplier();
  document.getElementById('hero_armor').innerHTML = AllCharacters.RAM.armor * heroArmorMultiplier();
}

function updateEnemyStats() {
  let enemy = getEnemy();
  document.getElementById('enemy_name').innerHTML = getEnemyName();
  document.getElementById('enemy_life').innerHTML = enemy.life 
    * TheGame.NPC_LIFE_DIFFICULTY_MAPPER.get(difficulty[choice_difficulty-1]);
  document.getElementById('enemy_strength').innerHTML = enemy.strength 
    * TheGame.NPC_STRENGTH_DIFFICULTY_MAPPER.get(difficulty[choice_difficulty-1]);
  document.getElementById('enemy_armor').innerHTML = enemy.armor 
    * TheGame.NPC_ARMOR_DIFFICULTY_MAPPER.get(difficulty[choice_difficulty-1]);
}

function update() {
  updateHeroStats();
  updateEnemyStats();
  updateAttack();
}

function getAttacker() {
  if (choice_action == 1) return AllCharacters.RAM;
  return getEnemy();
}

function getDefender() {
  if (choice_action != 1) return AllCharacters.RAM;
  return getEnemy();
}

function getAttackerStrengthMultiplier() {
  let attackerIsNPC = (choice_action != 1);
  if (attackerIsNPC) 
    return TheGame.NPC_STRENGTH_DIFFICULTY_MAPPER.get(difficulty[choice_difficulty-1]);
  return heroStrengthMultiplier();
}

function heroStrengthMultiplier() {
  let heroIsStrengthEnhanced = (choice_blessings == 2 || choice_blessings == 4);
  return heroIsStrengthEnhanced ? 
    TheGame.HERO_STRENGTH_ENHANCE_DIFFICULTY_MAPPER.get(difficulty[choice_difficulty-1]) : 1;
}

function getDefenderArmorMultiplier() {
  let attackerIsNPC = (choice_action != 1);
  if (attackerIsNPC) 
    return heroArmorMultiplier();
  return TheGame.NPC_ARMOR_DIFFICULTY_MAPPER.get(difficulty[choice_difficulty-1]);
}

function heroArmorMultiplier() {
  let heroIsArmorEnhanced = (choice_blessings == 3 || choice_blessings == 4);
  return heroIsArmorEnhanced ? 
    TheGame.HERO_ARMOR_ENHANCE_DIFFICULTY_MAPPER.get(difficulty[choice_difficulty-1]) : 1;
}

function getDefenderLifeMultiplier() {
  if (choice_action != 1) return 1;
  return TheGame.NPC_LIFE_DIFFICULTY_MAPPER.get(difficulty[choice_difficulty-1]);
}

function updateAttack() {
  let attacker = getAttacker();
  let defender = getDefender();

  let damageInfoUpdater = (label, damage) => {
    document.getElementById(label + '_damage').innerHTML = damage;
    let damageDished = CharacterAttributes.calulateDamageWithStrengthEnhanced(
      damage, attacker.strength, getAttackerStrengthMultiplier()
    );
    document.getElementById(label + '_dished').innerHTML = damageDished;
    let damageIncurred = CharacterAttributes.calulateDamageWithArmorReduced(
      damageDished, defender.armor, getDefenderArmorMultiplier()
    );
    document.getElementById(label + '_incurred').innerHTML = damageIncurred;
    document.getElementById(label + '_kill_hits').innerHTML = Math.ceil(
      (defender.life * getDefenderLifeMultiplier()) / damageIncurred);
  };

  let damageMultiplier = choice_action == 2 ? 0.5 : 1;

  let primary_attack = attacker.actions.find( a => a.type == 'primary' );
  document.getElementById('primary_attack_name').innerHTML = primary_attack.name;
  damageInfoUpdater('primary_min', primary_attack.minDamage * damageMultiplier);
  damageInfoUpdater('primary_max', primary_attack.maxDamage * damageMultiplier);

  let secondary_attack = attacker.actions.find( a => a.type == 'secondary' );
  document.getElementById('secondary_attack_name').innerHTML = secondary_attack.name;
  damageInfoUpdater('secondary_min', secondary_attack.minDamage * damageMultiplier);
  damageInfoUpdater('secondary_max', secondary_attack.maxDamage * damageMultiplier);
}

update();