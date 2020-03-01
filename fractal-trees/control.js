import { bus } from '../components/event-bus.js';

setBus(bus);

let initData = {
  choice: 1,
  bin_angle: 20,
  bin_seed_angle: 0,
  bin_level: 6,
  random_angle: 90,
  random_branches: 4,
  lsystem_choice: 1,
  lsystem_generations: 2,
  pythagoran_angle: 45,
  pythagoran_level: 5,
  pythagoran_line_art: true
};
setData(initData);

const choiceIds = ['bin_control', 'random_control', 'lsystem_control', 'pythagoran_control'];

document.getElementById('choice').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    removeAllTreeControl();
    document.getElementById(choiceIds[val-1]).style.display = 'block';
    bus.dispatch("ControlLFTrC", { choice: val });
  }
};

function removeAllTreeControl() {
  for (let choiceId of choiceIds) {
    document.getElementById(choiceId).style.display = 'none';
  }
}

document.getElementById('bin_control').style.display = initData.choice === 1 ? 'block' : 'none';

document.getElementById('bin_angle').value = initData.bin_angle;

document.getElementById('bin_angle').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLFTrba", { bin_angle: val });
};
document.getElementById('bin_seed_angle').value = initData.bin_seed_angle;

document.getElementById('bin_seed_angle').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLFTrbsa", { bin_seed_angle: val });
};

document.getElementById('bin_level').value = initData.bin_level;

document.getElementById('bin_level').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLFTrbl", { bin_level: val });
};

document.getElementById('random_control').style.display = initData.choice === 2 ? 'block' : 'none';

document.getElementById('random_angle').value = initData.random_angle;

let random_angle_updated = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLFTrra", { random_angle: val });
};
document.getElementById('random_angle').onclick = random_angle_updated;
document.getElementById('random_angle').ontouchend = random_angle_updated;

document.getElementById('random_branches').value = initData.random_branches;

let random_branches_updated = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLFTrrb", { random_branches: val });
};
document.getElementById('random_branches').onclick = random_branches_updated;
document.getElementById('random_branches').ontouchend = random_branches_updated;

document.getElementById('drawBtn').onclick = e => {
  bus.dispatch("ControlLFTrrd", {  });
};

document.getElementById('lsystem_control').style.display = initData.choice === 3 ? 'block' : 'none';

document.getElementById('lsystem_choice').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    setLSystemGenerationsSlider(val);
    bus.dispatch("ControlLFTlsc", { lsystem_choice: val });
  }
};

function setLSystemGenerationsSlider(lsystemChoice) {
  let genInfo = AllSystems.generationsInfo(lsystemChoice);
  document.getElementById('lsystem_generations').max = genInfo.max_generations;
  document.getElementById('lsystem_generations').min = genInfo.min_generations;
}
setLSystemGenerationsSlider(initData.lsystem_choice);

document.getElementById('lsystem_generations').value = initData.lsystem_generations;

document.getElementById('lsystem_generations').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLFTlsg", { lsystem_generations: val });
};

document.getElementById('pythagoran_control').style.display = initData.choice === 2 ? 'block' : 'none';

document.getElementById('pythagoran_angle').value = initData.pythagoran_angle;

document.getElementById('pythagoran_angle').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLFTpta", { pythagoran_angle: val });
};
document.getElementById('pythagoran_level').value = initData.pythagoran_level;

document.getElementById('pythagoran_level').onchange = e => {
  let val = Number(e.target.value);
  bus.dispatch("ControlLFTptl", { pythagoran_level: val });
};

document.getElementById('pythagoran_line_art').innerHTML = 'Colorful';

document.getElementById('pythagoran_line_art').onclick = e => {
  bus.dispatch("ControlLFTptta", { pythagoran_line_art: !pythagoran_line_art });
  document.getElementById('pythagoran_line_art').innerHTML = 
      pythagoran_line_art ? 'Colorful':'Line Art';
};