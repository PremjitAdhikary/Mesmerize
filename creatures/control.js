import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_creature: 1,
  creature_count: 5
};
setData(initData);

document.getElementById('choice_creature').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlCcc", { choice_creature: val });
  }
};

document.getElementById('creature_count').value = initData.creature_count;

document.getElementById('creature_count').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControCcs", { creature_count: val });
};