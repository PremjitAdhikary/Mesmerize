import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_algo: 1,
  choice_route_len: 1
};
setData(initData);

document.getElementById('choice_algo').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlCnBca", { choice_algo: val });
  }
};

document.getElementById('choice_route_len').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlCnBcrl", { choice_route_len: val });
  }
};