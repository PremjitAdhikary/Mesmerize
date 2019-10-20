import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  plot_speed: 50
};
setData(initData);

document.getElementById('plot_speed').value = initData.plot_speed;

document.getElementById('plot_speed').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlBFs", { plot_speed: val });
};