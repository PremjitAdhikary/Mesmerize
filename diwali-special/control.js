import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_hostel: 2,
  choice_four_fw: 1,
  choice_five_fw: 1
};
setData(initData);

document.getElementById('choice_hostel').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlDSch", { choice_hostel: val });
    showChoices();
  }
};

function showChoices() {
  document.getElementById('four_choice').style.display = (choice_hostel == 1 ? 'block' : 'none');
  document.getElementById('five_choice').style.display = (choice_hostel == 2 ? 'block' : 'none');
}

document.getElementById('four_fw').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlDSc4fw", { choice_four_fw: val });
  }
};

document.getElementById('five_fw').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlDSc5fw", { choice_five_fw: val });
  }
};

document.getElementById('fireBtn').onclick = () => bus.dispatch("ControlDSfb", {  });

showChoices();