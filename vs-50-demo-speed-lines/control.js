import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_effect: 1, 
  speed: 0,
  teleportLineStartWidth: 2, 
  teleportLineEndWidth: 6, 
  teleportLineTotalFrames: 8, 
  trailSpeed: 15, 
  trailFlyBeats: 10, 
  trailLineTotalFrames: 10, 
  trailArcTotalFrames: 10, 
  sweepSpeed: 12, 
  sweepArcTotalFrames: 20
};
setData(initData);

document.getElementById('choice_effect').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    showSubChoices(val);
    bus.dispatch("ControlV50DSPce", { choice_effect: val });
  }
};

document.getElementById('env_speed').value = initData.speed;

document.getElementById('env_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlV50DSPtcs", { speed: val });
};

let subChoices = ['teleport_choice', 'trail_choice', 'trail_arc_choice', 'sweep_arc_choice'];

function showSubChoices(choice) {
  subChoices.forEach(sc => document.getElementById(sc).style.display = 'none');
  document.getElementById(subChoices[choice-1]).style.display = 'block';
}
showSubChoices(1);

// teleport

document.getElementById('tc_start_width').value = initData.teleportLineStartWidth;

document.getElementById('tc_start_width').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlV50DSPtcsw", { teleportLineStartWidth: val });
};

document.getElementById('tc_end_width').value = initData.teleportLineEndWidth;

document.getElementById('tc_end_width').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlV50DSPtcew", { teleportLineEndWidth: val });
};

document.getElementById('tc_total_frames').value = initData.teleportLineTotalFrames;

document.getElementById('tc_total_frames').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlV50DSPtctf", { teleportLineTotalFrames: val });
};

// trail

document.getElementById('tl_speed').value = initData.trailSpeed;

document.getElementById('tl_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlV50DSPtls", { trailSpeed: val });
};

document.getElementById('tl_dist').value = initData.trailFlyBeats;

document.getElementById('tl_dist').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlV50DSPtld", { trailFlyBeats: val });
};

document.getElementById('tl_total_frames').value = initData.trailLineTotalFrames;

document.getElementById('tl_total_frames').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlV50DSPtltf", { trailLineTotalFrames: val });
};

// arc

document.getElementById('tla_total_frames').value = initData.trailArcTotalFrames;

document.getElementById('tla_total_frames').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlV50DSPtatf", { trailArcTotalFrames: val });
};

// sweep

document.getElementById('sa_speed').value = initData.sweepSpeed;

document.getElementById('sa_speed').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlV50DSPsas", { sweepSpeed: val });
};

document.getElementById('sa_total_frames').value = initData.sweepArcTotalFrames;

document.getElementById('sa_total_frames').onclick = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlV50DSPsatf", { sweepArcTotalFrames: val });
};