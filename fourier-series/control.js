import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  number: 5,
  wave: 1
};
setData(initData);

document.getElementById('choice').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlFSC", { wave: val });
  }
};

document.getElementById('number').value = initData.number;

document.getElementById('number').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlFSN", { number: val });
};