import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_radio: 1,
  choice_slider: 1,
  onclick_slider: 5,
  onchange_slider: 6,
  onchange_step_slider: 8,
  variable_slider: 15,
  variable_slider_min: 10,
  variable_slider_max: 20
};
setData(initData);

document.getElementById('choice_radio').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    // removeAllTreeControl();
    // document.getElementById(choiceIds[val-1]).style.display = 'block';
    bus.dispatch("ControlBcr", { choice_radio: val });
    toggleRadio(val);
  }
};

function toggleRadio(val) {
  let sliders = ['radio_enable', 'radio_disable'];
  for (let slider of sliders) {
    document.getElementById(slider).disabled = (val!=1);
  }
}

document.getElementById('choice_slider').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    // removeAllTreeControl();
    // document.getElementById(choiceIds[val-1]).style.display = 'block';
    bus.dispatch("ControlBcs", { choice_slider: val });
    toggleSlider(val);
  }
};

function toggleSlider(val) {
  let sliders = ['onclick_slider', 'onchange_slider', 'onchange_step_slider'];
  for (let slider of sliders) {
    document.getElementById(slider).disabled = (val!=1);
  }
}

document.getElementById('onclick_slider').value = initData.onclick_slider;

document.getElementById('onclick_slider').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControBclks", { onclick_slider: val });
};

document.getElementById('onchange_slider').value = initData.onchange_slider;
// document.getElementById('onchange_slider').valuehidden = true;

document.getElementById('onchange_slider').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControBchgs", { onchange_slider: val });
};

document.getElementById('onchange_step_slider').value = initData.onchange_step_slider;

document.getElementById('onchange_step_slider').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControBchgss", { onchange_step_slider: val });
};

document.getElementById('variable_slider').value = initData.variable_slider;
document.getElementById('variable_slider').min = initData.variable_slider_min;
document.getElementById('variable_slider').max = initData.variable_slider_max;

document.getElementById('variable_slider').onchange = e => {
  let val = Number(e.target.value);
  let min = Number(e.target.min);
  let max = Number(e.target.max);
  bus.dispatch("ControBvars", { 
    variable_slider: val,
    variable_slider_min: min,
    variable_slider_max: max,  
  });
};

document.getElementById('min_minus').onclick = e => {
  document.getElementById('variable_slider').min 
    = Number(document.getElementById('variable_slider').min)-10;
    bus.dispatch("ControBvarsmin", {
      variable_slider_min: Number(document.getElementById('variable_slider').min)
    });
};

document.getElementById('min_plus').onclick = e => {
  document.getElementById('variable_slider').min 
    = Number(document.getElementById('variable_slider').min)+10;
  bus.dispatch("ControBvarsmin", {
    variable_slider_min: Number(document.getElementById('variable_slider').min)
  });
};

document.getElementById('max_minus').onclick = e => {
  document.getElementById('variable_slider').max 
    = Number(document.getElementById('variable_slider').max)-10;
  bus.dispatch("ControBvarsmax", {
    variable_slider_max: Number(document.getElementById('variable_slider').max)
  });
};

document.getElementById('max_plus').onclick = e => {
  document.getElementById('variable_slider').max 
    = Number(document.getElementById('variable_slider').max)+10;
  bus.dispatch("ControBvarsmax", {
    variable_slider_max: Number(document.getElementById('variable_slider').max)
  });
};