import { bus } from '../components/event-bus.js';

let subAvailable = false;
let showSub = false;
let stateIndex = 0;
let totalStates = 10;

let subStateIndex = 0;
let totalSubStates = 10;

let choice_type = 1;

setBus(bus);
let initData = {
  choice_game: 100
};
setData(initData);

// control functions

function updateControls() {
  document.getElementById('main').style.display = !showSub ? 'block' : 'none';
  document.getElementById('sub').style.display = showSub ? 'block' : 'none';
  document.getElementById('load-sub-holder').style.display = subAvailable ? 'block' : 'none';
}

function updateStateIndex(index) {
  if (index >= 0 && index < totalStates) {
    stateIndex = index;
    bus.dispatch("ControlPPmi", { currentStateIndex: stateIndex });
    updateMainButtonControls();
  }
}

function updateMainButtonControls() {
  document.getElementById('move_slider').value = stateIndex;
  toggleClassForElement(document.getElementById('first'), 'disable', (stateIndex == 0));
  toggleClassForElement(document.getElementById('prev'), 'disable', (stateIndex == 0));
  toggleClassForElement(document.getElementById('last'), 'disable', (stateIndex == totalStates - 1));
  toggleClassForElement(document.getElementById('next'), 'disable', (stateIndex == totalStates - 1));
}

function updateSubStateIndex(index) {
  if (index >= 0 && index < totalSubStates) {
    subStateIndex = index;
    bus.dispatch("ControlPPsi", { currentStateIndex: subStateIndex });
    updateSubButtonControls();
  }
}

function updateSubButtonControls() {
  toggleClassForElement(document.getElementById('sub-first'), 'disable', (subStateIndex == 0));
  toggleClassForElement(document.getElementById('sub-prev'), 'disable', (subStateIndex == 0));
  toggleClassForElement(document.getElementById('sub-last'), 'disable', (subStateIndex == totalSubStates - 1));
  toggleClassForElement(document.getElementById('sub-next'), 'disable', (subStateIndex == totalSubStates - 1));
}

// register for events from sketch.js

bus.register("SketchPPsub", e => {
  subAvailable = e.detail.subAvailable;
  updateControls();
});

bus.register("SketchPPtotal", e => {
  stateIndex = 0;
  totalStates = e.detail.totalStates;
  document.getElementById('move_slider').max = totalStates - 1;
  updateMainButtonControls();
});

bus.register("SketchPPtotalSubStates", e => {
  subStateIndex = 0;
  totalSubStates = e.detail.totalStates;
  updateSubButtonControls();
});

// setup elements

document.getElementById('move_slider').value = 0;

document.getElementById('move_slider').onchange = e => {
  let val = Number(e.target.value);
  updateStateIndex(val);
};

document.getElementById('first').onclick = e => updateStateIndex(0);
document.getElementById('last').onclick = e => updateStateIndex(totalStates - 1);
document.getElementById('prev').onclick = e => updateStateIndex(stateIndex - 1);
document.getElementById('next').onclick = e => updateStateIndex(stateIndex + 1);

document.getElementById('load-sub').onclick = e => {
  showSub = true;
  updateControls();
  bus.dispatch("ControlPPls", { });
};

document.getElementById('sub-first').onclick = e => updateSubStateIndex(0);
document.getElementById('sub-last').onclick = e => updateSubStateIndex(totalSubStates - 1);
document.getElementById('sub-prev').onclick = e => updateSubStateIndex(subStateIndex - 1);
document.getElementById('sub-next').onclick = e => updateSubStateIndex(subStateIndex + 1);

document.getElementById('load-main').onclick = e => {
  showSub = false;
  updateControls();
  bus.dispatch("ControlPPlm", { });
};

document.getElementById('choice_type').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    choice_type = val;
    listGames();
  }
};

function listGames() {
  let parent = document.getElementById('choice_game');
  while (parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
  let allGames;
  switch(choice_type) {
    case 1:
      allGames = GameStore.favGames();
      break;
    case 2:
      allGames = GameStore.miniGames();
      break;
    case 3:
      allGames = GameStore.allGames();
      break;
  }
  let checked = false;
  for (let game of allGames) {
    let choice = document.createElement('radio-button');
    let choiceTxt = game.name + ' ' + (game.fav ? '*' : '') + (game.mini ? '^' : '');
    choice.appendChild(document.createTextNode(choiceTxt));
    choice.setAttribute("value", game.id);
    if (!checked) {
      choice.setAttribute("aria-checked", true);
      checked = true;
    }
    parent.appendChild(choice);
  }
  gameSelected(allGames[0].id);
}

document.getElementById('choice_game').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    gameSelected(val);
  }
};

function gameSelected(val) {
  bus.dispatch("ControlPPcg", { choice_game: val });
  subAvailable = false;
  stateIndex = 0;
  showSub = false;
  updateControls();
  updateMainButtonControls();
}

listGames();

updateControls();
updateMainButtonControls();