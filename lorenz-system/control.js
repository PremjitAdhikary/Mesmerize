import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  selectedSystem: 1,
  calculationSpeed: 4
};
setData(initData);

document.getElementById('choice_system').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlLScs", { selectedSystem: val });
  }
};

document.getElementById('calculation_speed').value = initData.calculationSpeed;

document.getElementById('calculation_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControLSrcs", { calculationSpeed: val });
};