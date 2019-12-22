import { bus } from '../components/event-bus.js';

let allFightData = {};

// the choices
let fairFight;
let fairFightAmateur;
let fairFightPro;
let fairFightEnhanced;
let fairFightSuper;
let biasedFightPro;
let biasedFightEnhanced;
let biasedFightSuper;
let fairFightSelectable;
let noFairFightSelectable;
let biasedFightSelectable;

let fightMap = {
  // fair amateurs
  11121: 'Amateur[Nerd](W)_Amateur[Bully]', 11211: 'Amateur[Nerd](W)_Amateur[Bully]',
  11122: 'Amateur[Bully](W)_Amateur[Nerd]', 11212: 'Amateur[Bully](W)_Amateur[Nerd]',
  11131: 'Amateur[Nerd](W)_Amateur[Captain]', 11311: 'Amateur[Nerd](W)_Amateur[Captain]',
  11132: 'Amateur[Nerd]_Amateur[Captain](W)', 11312: 'Amateur[Nerd]_Amateur[Captain](W)',
  11231: 'Amateur[Bully](W)_Amateur[Captain]', 11321: 'Amateur[Bully](W)_Amateur[Captain]',
  11232: 'Amateur[Captain](W)_Amateur[Bully]', 11322: 'Amateur[Captain](W)_Amateur[Bully]',
  // fair professionals
  12121: 'Professional[Boxer](W)_Professional[Karateka]', 12211: 'Professional[Boxer](W)_Professional[Karateka]',
  12122: 'Professional[Karateka](W)_Professional[Boxer]', 12212: 'Professional[Karateka](W)_Professional[Boxer]',
  12131: 'Professional[Boxer]_Professional[Taekwondo](W)', 12311: 'Professional[Boxer]_Professional[Taekwondo](W)',
  12132: 'Professional[Taekwondo]_Professional[Boxer](W)', 12312: 'Professional[Taekwondo]_Professional[Boxer](W)',
  12231: 'Professional[Taekwondo](W)_Professional[Karateka]', 12321: 'Professional[Taekwondo](W)_Professional[Karateka]',
  12232: 'Professional[Karateka](W)_Professional[Taekwondo]', 12322: 'Professional[Karateka](W)_Professional[Taekwondo]',
  // fair enhanced
  13121: 'Ninja[Shuriken Jutsu]_Equipped Boxer[Metal Arms](W)', 13211: 'Ninja[Shuriken Jutsu]_Equipped Boxer[Metal Arms](W)',
  13122: 'Equipped Boxer[Metal Arms]_Ninja[Shuriken Jutsu](W)', 13212: 'Equipped Boxer[Metal Arms]_Ninja[Shuriken Jutsu](W)',
  13131: 'Equipped Boxer[Metal Arms](W)_Samurai[Sword and Armor]', 13311: 'Equipped Boxer[Metal Arms](W)_Samurai[Sword and Armor]',
  13132: 'Samurai[Sword and Armor](W)_Equipped Boxer[Metal Arms]', 13312: 'Samurai[Sword and Armor](W)_Equipped Boxer[Metal Arms]',
  13231: 'Samurai[Sword and Armor]_Ninja[Shuriken Jutsu](W)', 13321: 'Samurai[Sword and Armor]_Ninja[Shuriken Jutsu](W)',
  13232: 'Ninja[Shuriken Jutsu]_Samurai[Sword and Armor](W)', 13322: 'Ninja[Shuriken Jutsu]_Samurai[Sword and Armor](W)',
  // fair supers
  14121: 'Hero[Superman](W)_Hero[Flash]', 14211: 'Hero[Superman](W)_Hero[Flash]',
  14122: 'Hero[Flash](W)_Hero[Superman]', 14212: 'Hero[Flash](W)_Hero[Superman]',
  14131: 'Hero[Equipped Batman](W)_Hero[Superman]', 14311: 'Hero[Equipped Batman](W)_Hero[Superman]',
  14132: 'Hero[Equipped Batman](W)_Hero[Superman]', 14312: 'Mage[Dark]_Mage[Elemental]',
  14141: 'Mage[Elemental]_Hero[Superman](W)', 14411: 'Mage[Elemental]_Hero[Superman](W)',
  14142: 'Mage[Elemental](W)_Hero[Superman]', 14412: 'Mage[Elemental](W)_Hero[Superman]',
  14151: 'Mage[Dark]_Hero[Superman](W)', 14511: 'Mage[Dark]_Hero[Superman](W)',
  14152: 'Hero[Superman]_Mage[Dark](W)', 14512: 'Hero[Superman]_Mage[Dark](W)',
  14231: 'Hero[Equipped Batman]_Hero[Flash](W)', 14321: 'Hero[Equipped Batman]_Hero[Flash](W)',
  14232: 'Hero[Equipped Batman](W)_Hero[Flash]', 14322: 'Hero[Equipped Batman](W)_Hero[Flash]',
  14241: 'Hero[Flash](W)_Mage[Elemental]', 14421: 'Hero[Flash](W)_Mage[Elemental]',
  14242: 'Mage[Elemental](W)_Hero[Flash]', 14422: 'Mage[Elemental](W)_Hero[Flash]',
  14251: 'Mage[Dark]_Hero[Flash](W)', 14521: 'Mage[Dark]_Hero[Flash](W)',
  14252: 'Hero[Flash]_Mage[Dark](W)', 14522: 'Hero[Flash]_Mage[Dark](W)',
  14341: 'Hero[Equipped Batman](W)_Mage[Elemental]', 14431: 'Hero[Equipped Batman](W)_Mage[Elemental]',
  14342: 'Hero[Equipped Batman]_Mage[Elemental](W)', 14432: 'Hero[Equipped Batman]_Mage[Elemental](W)',
  14351: 'Hero[Equipped Batman](W)_Mage[Dark]', 14531: 'Hero[Equipped Batman](W)_Mage[Dark]',
  14352: 'Hero[Equipped Batman]_Mage[Dark](W)', 14532: 'Hero[Equipped Batman]_Mage[Dark](W)',
  14451: 'Mage[Elemental](W)_Mage[Dark]', 14541: 'Mage[Elemental](W)_Mage[Dark]',
  14452: 'Mage[Dark](W)_Mage[Elemental]', 14542: 'Mage[Dark](W)_Mage[Elemental]',
  //biased professionals vs amateurs
  21111: 'Professional[Boxer](W)_Amateur[Nerd]',
  21121: 'Professional[Boxer](W)_Amateur[Bully]',
  21131: 'Amateur[Captain]_Professional[Boxer](W)',
  21211: 'Professional[Karateka](W)_Amateur[Nerd]',
  21221: 'Amateur[Bully]_Professional[Karateka](W)',
  21231: 'Professional[Karateka](W)_Amateur[Captain]',
  21311: 'Professional[Taekwondo](W)_Amateur[Nerd]',
  21321: 'Amateur[Bully]_Professional[Taekwondo](W)',
  21331: 'Professional[Taekwondo](W)_Amateur[Captain]',
  //biased enhanced vs professionals
  22111: 'Professional[Boxer]_Equipped Boxer[Metal Arms](W)',
  22121: 'Equipped Boxer[Metal Arms](W)_Professional[Karateka]',
  22131: 'Equipped Boxer[Metal Arms](W)_Professional[Taekwondo]',
  22211: 'Ninja[Shuriken Jutsu](W)_Professional[Boxer]',
  22221: 'Professional[Karateka]_Ninja[Shuriken Jutsu](W)',
  22231: 'Professional[Taekwondo]_Ninja[Shuriken Jutsu](W)',
  22311: 'Professional[Boxer]_Samurai[Sword and Armor](W)',
  22321: 'Professional[Karateka]_Samurai[Sword and Armor](W)',
  22331: 'Samurai[Sword and Armor](W)_Professional[Taekwondo]',
  //biased supers vs enhanced
  23111: 'Hero[Superman](W)_Equipped Boxer[Metal Arms]',
  23121: 'Hero[Superman](W)_Ninja[Shuriken Jutsu]',
  23131: 'Hero[Superman](W)_Samurai[Sword and Armor]',
  23211: 'Hero[Flash](W)_Equipped Boxer[Metal Arms]',
  23221: 'Hero[Flash](W)_Ninja[Shuriken Jutsu]',
  23231: 'Hero[Flash](W)_Samurai[Sword and Armor]',
  23311: 'Hero[Equipped Batman](W)_Equipped Boxer[Metal Arms]',
  23321: 'Hero[Equipped Batman](W)_Ninja[Shuriken Jutsu]',
  23331: 'Hero[Equipped Batman](W)_Samurai[Sword and Armor]',
  23411: 'Mage[Elemental](W)_Equipped Boxer[Metal Arms]',
  23421: 'Mage[Elemental](W)_Ninja[Shuriken Jutsu]',
  23431: 'Mage[Elemental](W)_Samurai[Sword and Armor]',
  23511: 'Mage[Dark](W)_Equipped Boxer[Metal Arms]',
  23521: 'Mage[Dark](W)_Ninja[Shuriken Jutsu]',
  23531: 'Mage[Dark](W)_Samurai[Sword and Armor]'
};

setBus(bus);
let initData = {
  choice: 1
};

function loadData(dataPath) {
  fetch(dataPath)
    .then(res => res.json())
    .then(fight_data => {
      bus.dispatch("ControlSCld", { fight_data });
      allFightData[dataPath] = fight_data;
    });
}

document.getElementById('playBtn').onclick = e => bus.dispatch("ControlSCpb", {  });

/**
 * selected is a 5 digit encoding. Starting from left to right:
 * 1st digit - fair or biased fight selected (1/2)
 * 2nd digit - class of fighter selected (1/2/3/4 based on classes available)
 * 3rd digit - fighters in the class (1/2/3/4/5 based on class selected)
 * 4th digit - fighters in the vs class (1/2/3/4/5 based on class selected)
 * 5th digit - fights available for the 2 fighters (1/2)
 */
document.getElementById('loadBtn').onclick = e => {
  if (noFairFightSelectable) return;
  let selected = 
    document.getElementById('choice-fight').getSelectedValue()*10000
    + (fairFight ? 
        document.getElementById('choice-class-fair').getSelectedValue() : 
        document.getElementById('choice-class-biased').getSelectedValue())*1000
    + getActiveFighter().getSelectedValue()*100
    + getActiveVs().getSelectedValue()*10
    + (fairFight ? 
        document.getElementById('choice-fair-fight').getSelectedValue() : 
        document.getElementById('choice-biased-fight').getSelectedValue())*1;
  loadData('./combats/'+fightMap[selected]+'.json');
  bus.dispatch("ControlSCc", { choice: selected });
};

function getActiveFighter() {
  if (fairFightAmateur) return document.getElementById('choice-fighter-fair-amateur');
  if (fairFightPro) return document.getElementById('choice-fighter-fair-pro');
  if (fairFightEnhanced) return document.getElementById('choice-fighter-fair-enhanced');
  if (fairFightSuper) return document.getElementById('choice-fighter-fair-super');
  if (biasedFightPro) return document.getElementById('choice-fighter-biased-pro');
  if (biasedFightEnhanced) return document.getElementById('choice-fighter-biased-enhanced');
  if (biasedFightSuper) return document.getElementById('choice-fighter-biased-super');
  return null;
}

function getActiveVs() {
  if (fairFightAmateur) return document.getElementById('choice-vs-fair-amateur');
  if (fairFightPro) return document.getElementById('choice-vs-fair-pro');
  if (fairFightEnhanced) return document.getElementById('choice-vs-fair-enhanced');
  if (fairFightSuper) return document.getElementById('choice-vs-fair-super');
  if (biasedFightPro) return document.getElementById('choice-vs-biased-amateur');
  if (biasedFightEnhanced) return document.getElementById('choice-vs-biased-pro');
  if (biasedFightSuper) return document.getElementById('choice-vs-biased-enhanced');
  return null;
}

setData(initData);

document.getElementById('choice-fight').onclick = e => updateControls();

document.getElementById('choice-class-fair').onclick = e => updateControls();

document.getElementById('choice-class-biased').onclick = e => updateControls();

document.getElementById('choice-fighter-fair-amateur-holder').onclick = e => updateControls();

document.getElementById('choice-vs-fair-amateur-holder').onclick = e => updateControls();

document.getElementById('choice-fighter-fair-pro-holder').onclick = e => updateControls();

document.getElementById('choice-vs-fair-pro-holder').onclick = e => updateControls();

document.getElementById('choice-fighter-fair-enhanced-holder').onclick = e => updateControls();

document.getElementById('choice-vs-fair-enhanced-holder').onclick = e => updateControls();

document.getElementById('choice-fighter-fair-super-holder').onclick = e => updateControls();

document.getElementById('choice-vs-fair-super-holder').onclick = e => updateControls();

document.getElementById('choice-fighter-biased-pro-holder').onclick = e => updateControls();

document.getElementById('choice-vs-biased-amateur-holder').onclick = e => updateControls();

document.getElementById('choice-fighter-biased-enhanced-holder').onclick = e => updateControls();

document.getElementById('choice-vs-biased-pro-holder').onclick = e => updateControls();

document.getElementById('choice-fighter-biased-super-holder').onclick = e => updateControls();

document.getElementById('choice-vs-biased-enhanced-holder').onclick = e => updateControls();

function updateControls() {
  analyzeChoices();
  displayControls();
}

function analyzeChoices() {
  fairFight = document.getElementById('choice-fight').getSelectedValue() === '1';
  fairFightAmateur = fairFight && document.getElementById('choice-class-fair').getSelectedValue() === '1';
  fairFightPro = fairFight && document.getElementById('choice-class-fair').getSelectedValue() === '2';
  fairFightEnhanced = fairFight && document.getElementById('choice-class-fair').getSelectedValue() === '3';
  fairFightSuper = fairFight && document.getElementById('choice-class-fair').getSelectedValue() === '4';
  biasedFightPro = !fairFight && document.getElementById('choice-class-biased').getSelectedValue() === '1';
  biasedFightEnhanced = !fairFight && document.getElementById('choice-class-biased').getSelectedValue() === '2';
  biasedFightSuper = !fairFight && document.getElementById('choice-class-biased').getSelectedValue() === '3';
  
  fairFightSelectable = false;
  noFairFightSelectable = false;
  biasedFightSelectable = false;
  if (fairFight) {
    noFairFightSelectable = 
      (fairFightAmateur && 
        (document.getElementById('choice-fighter-fair-amateur').getSelectedValue() === 
        document.getElementById('choice-vs-fair-amateur').getSelectedValue())) 
        ||
      (fairFightPro && 
        (document.getElementById('choice-fighter-fair-pro').getSelectedValue() === 
        document.getElementById('choice-vs-fair-pro').getSelectedValue())) 
        ||
      (fairFightEnhanced && 
        (document.getElementById('choice-fighter-fair-enhanced').getSelectedValue() === 
        document.getElementById('choice-vs-fair-enhanced').getSelectedValue())) 
        ||
      (fairFightSuper && 
        (document.getElementById('choice-fighter-fair-super').getSelectedValue() === 
        document.getElementById('choice-vs-fair-super').getSelectedValue()));
      
    fairFightSelectable = !noFairFightSelectable;
  } else {
    biasedFightSelectable = true;
  }
}

function displayControls() {
  document.getElementById('choice-class-fair-holder').style.display = fairFight ? 'block' : 'none';
  document.getElementById('choice-class-biased-holder').style.display = !fairFight ? 'block' : 'none';

  document.getElementById('choice-fighter-fair-amateur-holder').style.display = fairFightAmateur ? 'block' : 'none';
  document.getElementById('choice-vs-fair-amateur-holder').style.display = fairFightAmateur ? 'block' : 'none';

  document.getElementById('choice-fighter-fair-pro-holder').style.display = fairFightPro ? 'block' : 'none';
  document.getElementById('choice-vs-fair-pro-holder').style.display = fairFightPro ? 'block' : 'none';

  document.getElementById('choice-fighter-fair-enhanced-holder').style.display = fairFightEnhanced ? 'block' : 'none';
  document.getElementById('choice-vs-fair-enhanced-holder').style.display = fairFightEnhanced ? 'block' : 'none';

  document.getElementById('choice-fighter-fair-super-holder').style.display = fairFightSuper ? 'block' : 'none';
  document.getElementById('choice-vs-fair-super-holder').style.display = fairFightSuper ? 'block' : 'none';
  
  document.getElementById('choice-fighter-biased-pro-holder').style.display = biasedFightPro ? 'block' : 'none';
  document.getElementById('choice-vs-biased-amateur-holder').style.display = biasedFightPro ? 'block' : 'none';

  document.getElementById('choice-fighter-biased-enhanced-holder').style.display = biasedFightEnhanced ? 'block' : 'none';
  document.getElementById('choice-vs-biased-pro-holder').style.display = biasedFightEnhanced ? 'block' : 'none';

  document.getElementById('choice-fighter-biased-super-holder').style.display = biasedFightSuper ? 'block' : 'none';
  document.getElementById('choice-vs-biased-enhanced-holder').style.display = biasedFightSuper ? 'block' : 'none';

  document.getElementById('choice-fair-fight-holder').style.display = fairFightSelectable ? 'block' : 'none';
  document.getElementById('choice-no-fight-holder').style.display = noFairFightSelectable ? 'block' : 'none';
  document.getElementById('choice-biased-fight-holder').style.display = biasedFightSelectable ? 'block' : 'none';
}

updateControls();