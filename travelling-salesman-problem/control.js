import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_algo: 1,
  number_of_cities: 6
};
setData(initData);

document.getElementById('choice_algo').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlTSPca", { choice_algo: val });
  }
};

document.getElementById('reset').onclick = e => {
  bus.dispatch("ControlTSPr", {  });
};

document.getElementById('number_of_cities').value = initData.number_of_cities;

document.getElementById('number_of_cities').onchange = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlTSPrnoc", { number_of_cities: val });
  }
};