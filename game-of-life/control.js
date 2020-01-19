import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_game: 'random'
};
setData(initData);

document.getElementById('choice_game').onclick = e => {
  let val = e.target.value;
  if (val) {
    switch (val) {
      case 'oscillators':
        let oVal = document.getElementById('choice_oscillators').getSelectedValue();
        document.getElementById('choice_oscillators').style.display = 'block';
        document.getElementById('choice_guns').style.display = 'none';
        bus.dispatch("ControlGOLcrg", { choice_game: oVal });
        break;
      case 'guns':
        let gVal = document.getElementById('choice_guns').getSelectedValue();
        document.getElementById('choice_oscillators').style.display = 'none';
        document.getElementById('choice_guns').style.display = 'block';
        bus.dispatch("ControlGOLcrg", { choice_game: gVal });
        break;
      default:
        document.getElementById('choice_oscillators').style.display = 'none';
        document.getElementById('choice_guns').style.display = 'none';
        bus.dispatch("ControlGOLcrg", { choice_game: val });
        break;
    }
  }
};

document.getElementById('choice_oscillators').onclick = e => {
  let val = e.target.value;
  if (val) {
    bus.dispatch("ControlGOLcrg", { choice_game: val });
  }
};

document.getElementById('choice_oscillators').style.display = 'none';

document.getElementById('choice_guns').onclick = e => {
  let val = e.target.value;
  if (val) {
    bus.dispatch("ControlGOLcrg", { choice_game: val });
  }
};

document.getElementById('choice_guns').style.display = 'none';