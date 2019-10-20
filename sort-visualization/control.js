import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_sort: 1,
  choice_render: 1
};
setData(initData);

document.getElementById('choice_sort').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSVcs", { choice_sort: val });
  }
};

document.getElementById('choice_render').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSVcr", { choice_render: val });
  }
};