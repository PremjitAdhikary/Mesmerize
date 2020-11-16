import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_world: 1,
  show_info: false,
  choice_worm: 1,
  choice_fish: 1,
  choice_pollinators: 1
};
setData(initData);

const choiceIds = ['moving_world_control', 'living_world_control', 'symbiotic_world_control'];

function updateSketchHolderClass() {
  let clickable = show_info;
  let el = document.getElementById('sketch-holder');
  if (clickable && !el.classList.contains('clickable')) {
    el.classList.add('clickable');
  } else if (!clickable && el.classList.contains('clickable')) {
    el.classList.remove('clickable');
  }
}

document.getElementById('choice_world').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    removeAllElectronicLifeControl();
    document.getElementById(choiceIds[val-1]).style.display = 'block';
    bus.dispatch("ControlELcwr", { choice_world: val });
  }
};

function removeAllElectronicLifeControl() {
  for (let choiceId of choiceIds) {
    document.getElementById(choiceId).style.display = 'none';
  }
}

document.getElementById('launch').onclick = e => {
  bus.dispatch("ControlELl", {  });
};

document.getElementById('show_info').innerHTML = 'Show Info';

document.getElementById('show_info').onclick = e => {
  show_info = !show_info;
  bus.dispatch("ControlELsiT", { show_info: show_info });
  document.getElementById('show_info').innerHTML = 
    show_info ? 'Hide Info' : 'Show Info';

  updateSketchHolderClass();
};

document.getElementById('moving_world_control').style.display = 
  initData.choice_world === 1 ? 'block' : 'none';

document.getElementById('living_world_control').style.display = 
  initData.choice_world === 2 ? 'block' : 'none';

document.getElementById('choice_worm').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlELcw", { choice_worm: val });
  }
};

document.getElementById('choice_fish').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlELcf", { choice_fish: val });
  }
};

document.getElementById('symbiotic_world_control').style.display = 
  initData.choice_world === 3 ? 'block' : 'none';

document.getElementById('choice_pollinators').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlELcp", { choice_pollinators: val });
  }
};