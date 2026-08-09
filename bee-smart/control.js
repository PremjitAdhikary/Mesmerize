import { bus } from '../components/event-bus.js';

setBus(bus);
let elitism_value_idx = 1;
let elitism_values = [2, 5, 10, 20];
let initData = {
  choice_env: 0,
  choice_algo: 1, 
  bee_speed: 1, 
  mutation_chance: 5,
  elitism_limit: elitism_values[elitism_value_idx]
};
setData(initData);

let algo_running = false;

document.getElementById('choice_env').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSBce", { choice_env: val });
  }
};

document.getElementById('choice_algo').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSBca", { choice_algo: val });
  }
};

document.getElementById('mutation_chance').value = initData.mutation_chance;
document.getElementById('elitism_limit').value = elitism_value_idx;
document.getElementById('elitism_value').innerHTML = elitism_values[elitism_value_idx];
document.getElementById('bee_speed').value = initData.bee_speed;

document.getElementById('mutation_chance').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlSBmc", { mutation_chance: val });
};

document.getElementById('elitism_limit').onchange = e => {
  let val = Number(e.target.value);
  elitism_value_idx = val;
  document.getElementById('elitism_value').innerHTML = elitism_values[elitism_value_idx];
  bus.dispatch("ControlSBel", { elitism_limit: elitism_values[elitism_value_idx] });
};

document.getElementById('bee_speed').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlSBbSpeed", { bee_speed: val });
};

document.getElementById('gen_10').onclick = () => {
  toggleAlgoOptions(true);
  bus.dispatch("ControlSBg10", { call_back: () =>  toggleAlgoOptions(false) });
};

document.getElementById('gen_50').onclick = () => {
  toggleAlgoOptions(true);
  bus.dispatch("ControlSBg50", { call_back: () =>  toggleAlgoOptions(false) });
};

function toggleEnvSelector(val) {
  let selectors = ['radio_zero', 'radio_one', 'radio_two', 'radio_three', 'radio_four', 'radio_five'];
  selectors.forEach(s => document.getElementById(s).disabled = val);
}

function toggleAlgoSelector(val) {
  let selectors = ['radio_ga', 'radio_pga'];
  selectors.forEach(s => document.getElementById(s).disabled = val);
}

function toggleAlgoOptions(val) {
  document.getElementById('bee_speed').disabled = val;
  document.getElementById('mutation_chance').disabled = val;
  document.getElementById('elitism_limit').disabled = val;
  toggleClassForElement(document.getElementById('gen_10'), 'disable', val);
  toggleClassForElement(document.getElementById('gen_50'), 'disable', val);
}

document.getElementById('algo_start').onclick = e => {
  algo_running = !algo_running;
  toggleEnvSelector(algo_running);
  toggleAlgoSelector(algo_running);
  toggleAlgoOptions(!algo_running);
  document.getElementById('algo_start').innerHTML = algo_running ? 'End Algorithm' : 'Run Algorithm';
  bus.dispatch(algo_running ? "ControlSBra" : "ControlSBsa", { });
};