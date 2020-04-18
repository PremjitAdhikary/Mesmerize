import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  choice_tree: 1,
  color_quadtree: false
};
setData(initData);

document.getElementById('choice_tree').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSCcrt", { choice_tree: val });
  }
};

document.getElementById('color_quadtree').innerHTML = 'Show Quadtree';

document.getElementById('color_quadtree').onclick = e => {
  bus.dispatch("ControlSCTqt", { color_quadtree: !color_quadtree });
  document.getElementById('color_quadtree').innerHTML = 
    (color_quadtree ? 'Show Quadtree' : 'Hide Quadtree');
  updateSketchHolderClass(color_quadtree);
};

function updateSketchHolderClass(color_quadtree) {
  let el = document.getElementById('sketch-holder');
  if (color_quadtree && !el.classList.contains('clickable')) {
    el.classList.add('clickable');
  } else if (!color_quadtree && el.classList.contains('clickable')) {
    el.classList.remove('clickable');
  }
}