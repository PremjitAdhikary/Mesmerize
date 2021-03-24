import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_region: 1,
  choice_stat: 1
};
setData(initData);

document.getElementById('choice_region').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSIcr", { choice_region: val });
  }
};

document.getElementById('choice_stat').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSIcs", { choice_stat: val });
  }
};