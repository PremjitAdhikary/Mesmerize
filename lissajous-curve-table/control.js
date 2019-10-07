import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  startSize: 6,
  startSpeed: 5
};
setData(initData);

document.getElementById('tableSize').value = initData.startSize;

document.getElementById('tableSize').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLCTTablSize", { size: val });
};

document.getElementById('angleSpeed').value = initData.startSpeed;

document.getElementById('angleSpeed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLCTAngleSpeed", { speed: val });
};