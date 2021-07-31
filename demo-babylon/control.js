import { bus } from '../components/event-bus.js';

let initData = {
  choice_color: 1,
  box_size_slider: 1
};

document.getElementById('choice_color').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlDBcc", { choice_color: val });
  }
};

document.getElementById('box_size_slider').value = initData.box_size_slider;
bus.dispatch("ControlDBbss", { box_size_slider: initData.box_size_slider });
document.getElementById('box_size_slider').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlDBbss", { box_size_slider: val });
};