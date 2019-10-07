import { bus } from "../components/event-bus.js";

setBus(bus);

let initData = {
  curve_a: 1,
  curve_b: 1,
  size_A: 100,
  size_B: 100
};
setData(initData);

document.getElementById('const_a').value = initData.curve_a;

document.getElementById('const_a').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLCTCca", { curve_a: val });
};

document.getElementById('const_b').value = initData.curve_b;

document.getElementById('const_b').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLCTCcb", { curve_b: val });
};

document.getElementById('size_A').value = initData.size_A;

document.getElementById('size_A').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLCTCsA", { size_A: val });
};

document.getElementById('size_B').value = initData.size_B;

document.getElementById('size_B').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLCTCsB", { size_B: val });
};