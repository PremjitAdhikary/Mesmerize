import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_dla: 1
};
setData(initData);

document.getElementById('choice_dla').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlDlaCdla", { choice_dla: val });
  }
};