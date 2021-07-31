import { bus } from '../components/event-bus.js';

let initData = {
  paused: true
};

let viewToggle = e => {
  initData.paused = !initData.paused;
  bus.dispatch("ControlPS3pu", { paused: initData.paused });
  document.getElementById('pause_unpause').innerHTML = 
    initData.paused ? 'Run':'Pause';
};

document.getElementById('pause_unpause').onclick = viewToggle;

viewToggle();