import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_terrain: 'mesh',
  choice_direction: 'over'
};
setData(initData);

document.getElementById('choice_terrain').onclick = e => {
  let val = e.target.value;
  if (val) {
    bus.dispatch("ControlTct", { choice_terrain: val });
  }
};

document.getElementById('choice_direction').onclick = e => {
  let val = e.target.value;
  if (val) {
    bus.dispatch("ControlTcd", { choice_direction: val });
  }
};