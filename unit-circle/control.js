import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice: 1
};
setData(initData);

document.getElementById('choice').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlUC", { choice: val });
  }
};