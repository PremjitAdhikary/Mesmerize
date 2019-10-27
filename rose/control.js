import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice: 1,
  numerator: 3,
  denominator: 4,
  offset: 0,
  maurer_numerator: 7,
  maurer_denominator: 19
};
setData(initData);

const choiceIds = ['rose_sliders', 'maurer_sliders'];

document.getElementById('choice').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    removeAllRoseControl();
    document.getElementById(choiceIds[val-1]).style.display = 'block';
    bus.dispatch("ControlRcr", { choice: val });
  }
};

function removeAllRoseControl() {
  for (let choiceId of choiceIds) {
    document.getElementById(choiceId).style.display = 'none';
  }
}

document.getElementById('rose_sliders').style.display = initData.choice === 1 ? 'block' : 'none';
document.getElementById('maurer_sliders').style.display = initData.choice === 2 ? 'block' : 'none';

document.getElementById('numerator').value = initData.numerator;

document.getElementById('numerator').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlRns", { numerator: val });
};

document.getElementById('denominator').value = initData.denominator;

document.getElementById('denominator').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlRds", { denominator: val });
};

document.getElementById('offset').value = initData.offset;

document.getElementById('offset').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlRos", { offset: val });
};

document.getElementById('maurer_sliders').style.display = initData.choice === 2 ? 'block' : 'none';

document.getElementById('maurer_numerator').value = initData.maurer_numerator;

document.getElementById('maurer_numerator').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlRmns", { maurer_numerator: val });
};

document.getElementById('maurer_denominator').value = initData.maurer_denominator;

document.getElementById('maurer_denominator').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlRmds", { maurer_denominator: val });
};