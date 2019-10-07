import { bus } from "../components/event-bus.js";

setBus(bus);

let initData = {
  number_of_circles: 3
};
setData(initData);

document.getElementById('number_of_circles').value = initData.number_of_circles;

document.getElementById('number_of_circles').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlSG", { number_of_circles: val });
};