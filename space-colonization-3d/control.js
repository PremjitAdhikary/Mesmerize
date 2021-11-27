import { bus } from '../components/event-bus.js';

let initData = {
  choice_tree: 1, 
  btn_show_tree: true, 
  btn_show_texture: true
};

document.getElementById('choice_tree').onclick = e => {
  let val = Number(e.target.value);
  if (val) {
    bus.dispatch("ControlSC3ct", { choice_tree: val });
    initData.btn_show_tree = true;
    initData.btn_show_texture = true;
    btnShowTextureClicked(true);
    toggleClassForElement(document.getElementById('generate_tree'), 'disable', false);
    toggleClassForElement(document.getElementById('show_tree'), 'disable', true);
    btnShowTreeClicked(initData.btn_show_tree);
  }
};

document.getElementById('generate_tree').onclick = e => {
  toggleClassForElement(document.getElementById('generate_tree'), 'disable', true);
  bus.dispatch("ControlSC3gt", { });
};

toggleClassForElement(document.getElementById('show_tree'), 'disable', true);
document.getElementById('show_tree').onclick = e => {
  initData.btn_show_tree = !initData.btn_show_tree;
  btnShowTreeClicked(initData.btn_show_tree);
};

document.getElementById('show_texture').style.display = 'none';
document.getElementById('show_texture').onclick = e => {
  initData.btn_show_texture = !initData.btn_show_texture;
  btnShowTextureClicked(initData.btn_show_texture);
};

function btnShowTreeClicked(val) {
  document.getElementById('show_tree').innerHTML = val ? 'Show Tree' : 'Show Nodes';
  document.getElementById('show_texture').style.display = val ? 'none' : 'inline';
  bus.dispatch("ControlSC3bc", { btn_show_tree: val });
}

function btnShowTextureClicked(val) {
  document.getElementById('show_texture').innerHTML = val ? 'Show Texture' : 'Hide Texture';
  bus.dispatch("ControlSC3bst", { btn_show_texture: val });
}

bus.register("ControlSC3tg", e => {
  toggleClassForElement(document.getElementById('show_tree'), 'disable', false);
});

bus.dispatch("ControlSC3init", { initData: initData });