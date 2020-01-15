import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice: 1,
  forward_base_angle: 0,
  forward_child_angle: 0,
  forward_segments: 3,
  inverse_segments: 5,
  inverse_length: 5,
  inverse_anchored: false
};
setData(initData);

document.getElementById('choice').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    document.getElementById('forward_control').style.display = (val === 1 ? 'block' : 'none');
    document.getElementById('inverse_control').style.display = (val === 1 ? 'none' : 'block');
    updateSketchHolderClass(val);
    bus.dispatch("ControlKcr", { choice: val });
  }
};

function updateSketchHolderClass(val) {
  let el = document.getElementById('sketch-holder');
  if (val === 1 && el.classList.contains('clickable')) {
    el.classList.remove('clickable');
  } else if (val !== 1 && !el.classList.contains('clickable')) {
    el.classList.add('clickable');
  }
}

document.getElementById('forward_base_angle').onchange = e => {
  let val = Number(e.target.value);
  if (!isNaN(val)) {
    bus.dispatch("ControlKsfba", { forward_base_angle: val });
  }
};

document.getElementById('forward_base_angle').value = initData.forward_base_angle;

document.getElementById('forward_child_angle').onchange = e => {
  let val = Number(e.target.value);
  if (!isNaN(val)) {
    bus.dispatch("ControlKsfca", { forward_child_angle: val });
  }
};

document.getElementById('forward_child_angle').value = initData.forward_child_angle;

document.getElementById('forward_segments').onchange = e => {
  let val = Number(e.target.value);
  if (!isNaN(val)) {
    bus.dispatch("ControlKsfs", { forward_segments: val });
  }
};

document.getElementById('forward_segments').value = initData.forward_segments;

document.getElementById('inverse_length').onchange = e => {
  let val = Number(e.target.value);
  if (!isNaN(val)) {
    bus.dispatch("ControlKsil", { inverse_length: val });
  }
};

document.getElementById('inverse_length').value = initData.inverse_length;

document.getElementById('inverse_segments').onchange = e => {
  let val = Number(e.target.value);
  if (!isNaN(val)) {
    bus.dispatch("ControlKsis", { inverse_segments: val });
  }
};

document.getElementById('inverse_segments').value = initData.inverse_segments;

document.getElementById('toggleAnchorBtn').onclick = e => {
  bus.dispatch("ControlKabis", {  });
};

document.getElementById('inverse_control').style.display = 'none';