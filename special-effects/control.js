import { bus } from '../components/event-bus.js';

let ripple_color = false;
let ripple_drag = false;
let fire_burner = false;

setBus(bus);

let initData = {
  choice: 1,
  ripple_reach: 10,
  ripple_color: ripple_color,
  ripple_drag: ripple_drag,
  ripple_frequency: 5,
  fire_choice: 1,
  fire_burner: fire_burner,
  burn_size: 15
};
setData(initData);

const choiceIds = ['ripple_control', 'fire_control'];

document.getElementById('choice').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    removeAllEffectsControl();
    document.getElementById(choiceIds[val-1]).style.display = 'block';
    bus.dispatch("ControlSErC", { choice: val });
    updateSketchHolderClass();
  }
};

function removeAllEffectsControl() {
  for (let choiceId of choiceIds) {
    document.getElementById(choiceId).style.display = 'none';
  }
}

function updateSketchHolderClass() {
  let clickable = (choice == 1 && ripple_drag) || (choice == 2 && fire_burner);
  let el = document.getElementById('sketch-holder');
  if (clickable && !el.classList.contains('clickable')) {
    el.classList.add('clickable');
  } else if (!clickable && el.classList.contains('clickable')) {
    el.classList.remove('clickable');
  }
}

document.getElementById('ripple_control').style.display = initData.choice === 1 ? 'block' : 'none';

document.getElementById('ripple_reach').value = initData.ripple_reach;

document.getElementById('ripple_reach').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlSErrr", { ripple_reach: val });
};

document.getElementById('ripple_color').innerHTML = 'Colorful';

document.getElementById('ripple_color').onclick = e => {
  ripple_color = !ripple_color;
  bus.dispatch("ControlSErcT", { ripple_color: ripple_color });
  document.getElementById('ripple_color').innerHTML = 
    ripple_color ? 'Mono' : 'Colorful';
};

document.getElementById('ripple_drag').innerHTML = 'Drag';

document.getElementById('ripple_drag').onclick = e => {
  ripple_drag = !ripple_drag;
  bus.dispatch("ControlSErdT", { ripple_drag: ripple_drag });
  document.getElementById('ripple_drag').innerHTML = 
    ripple_drag ? 'Random' : 'Drag';

  updateSketchHolderClass();
  document.getElementById('ripple_frequency_holder').style.display = !ripple_drag ? 'block' : 'none';
};

document.getElementById('ripple_frequency_holder').style.display = !initData.ripple_drag ? 'block' : 'none';

document.getElementById('ripple_frequency').value = initData.ripple_frequency;

document.getElementById('ripple_frequency').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlSErfr", { ripple_frequency: val });
};


document.getElementById('fire_control').style.display = initData.choice === 2 ? 'block' : 'none';

document.getElementById('fire_choice').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSEfcC", { fire_choice: val });
  }
};

document.getElementById('fire_burner').innerHTML = 'Burner';

document.getElementById('fire_burner').onclick = e => {
  fire_burner = !fire_burner;
  bus.dispatch("ControlSEfbT", { fire_burner: fire_burner });
  document.getElementById('fire_burner').innerHTML = 
    fire_burner ? 'Fire Wall' : 'Burner';

  updateSketchHolderClass();
  document.getElementById('burn_size_holder').style.display = fire_burner ? 'block' : 'none';
};

document.getElementById('burn_size_holder').style.display = fire_burner ? 'block' : 'none';

document.getElementById('burn_size').value = initData.burn_size;

document.getElementById('burn_size').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlSEbsr", { burn_size: val });
};