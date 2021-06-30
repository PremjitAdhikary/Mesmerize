import { bus } from '../components/event-bus.js';

setBus(bus);
let initData = {
  system: Repo.CANTOR
};
setData(initData);

let allData;
let elemIdMap = new Map([
  ['cnt', 'choice_cantor'], ['kch', 'choice_koch'], ['mnk', 'choice_mink'], ['srp', 'choice_sier'],
  ['tri', 'choice_tri'], ['qud', 'choice_quad'], ['crc', 'choice_circ'], 
  ['nmd', 'choice_shape_name'], ['cur', 'choice_curve'], ['stk', 'choice_stick'], 
  ['bsh', 'choice_bush'], ['tr', 'choice_tree'], ['phl', 'choice_phyllotaxis']
]);

function setupData() {
  allData = new Map();

  let collMap = new Map();
  collMap.set('selected', 'cnt');
  collMap.set('cnt', [Repo.CANTOR, Repo.CANTOR_A, Repo.CANTOR_PERP, Repo.VICSEK_SF]);
  collMap.set('kch', [Repo.KOCH_C, Repo.KOCH_C_V, Repo.KOCH_SF, Repo.KOCH_X_SF, Repo.CESARO_X_SF]);
  collMap.set('mnk', [Repo.MINKOWSKI_C, Repo.MINKOWSKI_SF, Repo.MINKOWSKI_SF_V1, Repo.MINKOWSKI_SF_V2]);
  collMap.set('srp', [Repo.SIERPINSKI_T, Repo.SIERPINSKI_G, Repo.SIERPINSKI_C, Repo.SIERPINSKI_P, Repo.SIERPINSKI_S, Repo.SIERPINSKI_CR]);
  allData.set('coll', collMap);
  allData.set('selected', 'coll');

  let shapesMap = new Map();
  shapesMap.set('selected', 'tri');
  shapesMap.set('tri', [Repo.TERDRAGON, Repo.TRI_PATT_1, Repo.TRI_PATT_1A]);
  shapesMap.set('qud', [Repo.QUAD_PATT_1, Repo.QUAD_PATT_2, Repo.QUAD_PATT_3]);
  shapesMap.set('crc', [Repo.CIR_PATT_1, Repo.CIR_PATT_2]);
  shapesMap.set('nmd', [Repo.QUAD_PATT_4, Repo.QUAD_PATT_5, Repo.QUAD_PATT_6, Repo.QUAD_PATT_7]);
  allData.set('shp', shapesMap);

  let curvesMap = new Map();
  curvesMap.set('selected', 'cur');
  curvesMap.set('cur', [Repo.PEANO_C, Repo.HILBERT_C, Repo.MOORE_C, Repo.DRAGON_C, Repo.LEVY_C, Repo.GOSPER_C]);
  allData.set('crv', curvesMap);

  let natureMap = new Map();
  natureMap.set('selected', 'stk');
  natureMap.set('stk', [Repo.STICKS_1, Repo.STICKS_2, Repo.STICKS_3, Repo.STICKS_4, Repo.STICKS_5, Repo.STICKS_6]);
  natureMap.set('bsh', [Repo.BUSH_1, Repo.BUSH_2, Repo.BUSH_3, Repo.BUSH_4, Repo.BUSH_5]);
  natureMap.set('tr', [Repo.BINARY_T, Repo.TRINARY_T, Repo.RANDOM_T, Repo.PYTHAGOREAN_T]);
  natureMap.set('phl', [Repo.PHYLLOTAXIS_1, Repo.PHYLLOTAXIS_2, Repo.PHYLLOTAXIS_3]);
  allData.set('ntr', natureMap);
}
setupData();

document.getElementById('choice_main').onclick = e => {
  let val = e.target.value;
  if (val) {
    allData.set('selected', val);
    updateChoice();
    selectActual();
  }
};

document.getElementById('choice_collection').onclick = e => {
  let val = e.target.value;
  if (val) {
    allData.get('coll').set('selected', val);
    updateChoice();
    selectActual();
  }
};

document.getElementById('choice_cantor').onclick = e => validateChoice(e);

document.getElementById('choice_koch').onclick = e => validateChoice(e);

document.getElementById('choice_mink').onclick = e => validateChoice(e);

document.getElementById('choice_sier').onclick = e => validateChoice(e);

document.getElementById('choice_shapes').onclick = e => {
  let val = e.target.value;
  if (val) {
    allData.get('shp').set('selected', val);
    updateChoice();
    selectActual();
  }
};

document.getElementById('choice_tri').onclick = e => validateChoice(e);

document.getElementById('choice_quad').onclick = e => validateChoice(e);

document.getElementById('choice_circ').onclick = e => validateChoice(e);

document.getElementById('choice_shape_name').onclick = e => validateChoice(e);

document.getElementById('choice_curve').onclick = e => validateChoice(e);

document.getElementById('choice_nature').onclick = e => {
  let val = e.target.value;
  if (val) {
    allData.get('ntr').set('selected', val);
    updateChoice();
    selectActual();
  }
};

document.getElementById('choice_stick').onclick = e => validateChoice(e);

document.getElementById('choice_bush').onclick = e => validateChoice(e);

document.getElementById('choice_tree').onclick = e => validateChoice(e);

document.getElementById('choice_phyllotaxis').onclick = e => validateChoice(e);

function validateChoice(e) {
  let val = Number(e.target.value);
  if (val) {
    selectActual();
  }
}

function selectActual() {
  let sub = allData.get(allData.get('selected'));
  let actual = sub.get(sub.get('selected'));
  let selected = document.getElementById(elemIdMap.get(sub.get('selected'))).getSelectedValue();
  system = actual[selected-1];
}

function updateChoice() {
  displayControls();
}

function displayControls() {
  document.getElementById('group_collection').style.display = (allData.get('selected') == 'coll' ? 'block' : 'none');
  document.getElementById('group_cantor').style.display = (allData.get('selected') == 'coll' && allData.get('coll').get('selected') == 'cnt' ? 'block' : 'none');
  document.getElementById('group_koch').style.display = (allData.get('selected') == 'coll' && allData.get('coll').get('selected') == 'kch' ? 'block' : 'none');
  document.getElementById('group_mink').style.display = (allData.get('selected') == 'coll' && allData.get('coll').get('selected') == 'mnk' ? 'block' : 'none');
  document.getElementById('group_sier').style.display = (allData.get('selected') == 'coll' && allData.get('coll').get('selected') == 'srp' ? 'block' : 'none');
  
  document.getElementById('group_shapes').style.display = (allData.get('selected') == 'shp' ? 'block' : 'none');
  document.getElementById('group_tri').style.display = (allData.get('selected') == 'shp' && allData.get('shp').get('selected') == 'tri' ? 'block' : 'none');
  document.getElementById('group_quad').style.display = (allData.get('selected') == 'shp' && allData.get('shp').get('selected') == 'qud' ? 'block' : 'none');
  document.getElementById('group_circ').style.display = (allData.get('selected') == 'shp' && allData.get('shp').get('selected') == 'crc' ? 'block' : 'none');
  document.getElementById('group_shape_name').style.display = (allData.get('selected') == 'shp' && allData.get('shp').get('selected') == 'nmd' ? 'block' : 'none');

  document.getElementById('group_curve').style.display = (allData.get('selected') == 'crv' && allData.get('crv').get('selected') == 'cur' ? 'block' : 'none');

  document.getElementById('group_nature').style.display = (allData.get('selected') == 'ntr' ? 'block' : 'none');
  document.getElementById('group_stick').style.display = (allData.get('selected') == 'ntr' && allData.get('ntr').get('selected') == 'stk' ? 'block' : 'none');
  document.getElementById('group_bush').style.display = (allData.get('selected') == 'ntr' && allData.get('ntr').get('selected') == 'bsh' ? 'block' : 'none');
  document.getElementById('group_tree').style.display = (allData.get('selected') == 'ntr' && allData.get('ntr').get('selected') == 'tr' ? 'block' : 'none');
  document.getElementById('group_phyllotaxis').style.display = (allData.get('selected') == 'ntr' && allData.get('ntr').get('selected') == 'phl' ? 'block' : 'none');
}

document.getElementById('launchBtn').onclick = e => {
  bus.dispatch("ControlLSlbb", { system: system });
}

displayControls();