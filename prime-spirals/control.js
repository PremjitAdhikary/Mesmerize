import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  zoom: 10
};
setData(initData);

document.getElementById('zoom').value = initData.zoom;

document.getElementById('zoom').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlPSz", { zoom: val });
};