import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_tree: 1,
  choice_op: 1,
  query_size: 25
};
setData(initData);

const controlIds = ['insert_controls', 'query_controls'];

document.getElementById('choice_tree').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlQVct", { choice_tree: val });
  }
};

document.getElementById('choice_op').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    remoceAllOpControls();
    document.getElementById(controlIds[val-1]).style.display = 'block';
    bus.dispatch("ControlQVco", { choice_op: val });
  }
};

function remoceAllOpControls() {
  for (let controlId of controlIds) {
    document.getElementById(controlId).style.display = 'none';
  }
}

document.getElementById('insert_controls').style.display = initData.choice_op === 1 ? 'block' : 'none';

document.getElementById('p5').onclick = e => {
  bus.dispatch("ControlQVbip", { insert_points: 5 });
};

document.getElementById('p10').onclick = e => {
  bus.dispatch("ControlQVbip", { insert_points: 10 });
};

document.getElementById('p20').onclick = e => {
  bus.dispatch("ControlQVbip", { insert_points: 20 });
};

document.getElementById('query_controls').style.display = initData.choice_op === 2 ? 'block' : 'none';

document.getElementById('query_size').value = initData.query_size;

document.getElementById('query_size').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlQVsqs", { query_size: val });
};