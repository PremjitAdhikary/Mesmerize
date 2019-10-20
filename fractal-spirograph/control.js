import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice: 1,
  numberOfCircles: 5,
  konstantMultiplier: 1,
  konstant: 4,
  ratio: 0.4
};
setData(initData);

document.getElementById('choice').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlFCc", { choice: val });
  }
};

document.getElementById('numberOfCircles').value = initData.numberOfCircles;

document.getElementById('numberOfCircles').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControFCnoc", { numberOfCircles: val });
};

document.getElementById('konstantMultiplier').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlFCckm", { konstantMultiplier: val });
  }
};

document.getElementById('konstant').value = initData.konstant;

document.getElementById('konstant').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControFCk", { konstant: val });
};

document.getElementById('ratio').value = initData.ratio;

document.getElementById('ratio').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControFCr", { ratio: val });
};