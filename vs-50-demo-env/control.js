import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_env: 1
};
setData(initData);

document.getElementById('choice_env').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlV50DENVce", { choice_env: val });
  }
};