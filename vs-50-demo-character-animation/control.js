import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  characters_radio: 1, 
  hero_moves_radio: 1, 
  normal_moves_radio: 1
};
setData(initData);

document.getElementById('characters_radio').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    updateMovesRadio(val);
    bus.dispatch("ControlV50DCAcr", { characters_radio: val });
  }
};

function stopLoop() {
  document.getElementById('loop_btn').innerHTML = 'Start';
  bus.dispatch("ControlV50DCAlstopb", { });
}

function updateActionBtns(isHero, val) {
  stopLoop();
  let valToCheck = isHero ? 2 : 1;
  document.getElementById('loop_action_btns').style.display = val <= valToCheck ? 'block' : 'none';
  document.getElementById('single_action_btns').style.display = val > valToCheck ? 'block' : 'none';
}

function updateMovesRadio(val) {
  let isHero = val == 1;
  document.getElementById('hero_moves_radio').style.display = isHero ? 'block' : 'none';
  document.getElementById('normal_moves_radio').style.display = !isHero ? 'block' : 'none';
  updateActionBtns(isHero, isHero ? 
    Number(document.getElementById('hero_moves_radio').getSelectedValue()) : 
    Number(document.getElementById('normal_moves_radio').getSelectedValue()))
}

updateMovesRadio(initData.characters_radio);

document.getElementById('hero_moves_radio').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    updateActionBtns(true, val);
    bus.dispatch("ControlV50DCAhmr", { hero_moves_radio: val });
  }
};

document.getElementById('normal_moves_radio').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    updateActionBtns(false, val);
    bus.dispatch("ControlV50DCAnmr", { normal_moves_radio: val });
  }
};

document.getElementById('loop_btn').onclick = e => {
  if (e.target.innerHTML == 'Start') {
    e.target.innerHTML = 'Stop';
    bus.dispatch("ControlV50DCAlstartb", { });
  } else {
    stopLoop();
  }
};

document.getElementById('action_btn').onclick = e => {
  bus.dispatch("ControlV50DCAab", { });
};