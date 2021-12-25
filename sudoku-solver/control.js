import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_game: 1, 
  choice_algo: 1, 
  speed: 1
};
setData(initData);

document.getElementById('easy_random').onclick = e => loadGame(1);
document.getElementById('normal_random').onclick = e => loadGame(2);
document.getElementById('hard_random').onclick = e => loadGame(3);
document.getElementById('brute_force_killer').onclick = e => loadGame(4);

function loadGame(game) {
  bus.dispatch("ControlSSblg", { choice_game: game });
}

document.getElementById('solve').onclick = () => bus.dispatch("ControlSSbsg", { });

document.getElementById('choice_algo').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSSca", { choice_algo: val });
  }
};

document.getElementById('speed').value = initData.speed;

document.getElementById('speed').onchange = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSSrs", { speed: val });
  }
};