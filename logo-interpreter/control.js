import { bus } from '../components/event-bus.js';

setBus(bus);

let alphaMap = new Map([
  [' ', 'pu rt 90 fd 20 lt 90 \n\n'],
  ['a', 'pd rt 20 fd 56  \nrt 140 fd 33 \nrt 90 fd 20 \nlt 160 fd 20 \nrt 70 fd 15 \nlt 70 pu fd 10 lt 90 \n\n'],
  ['b', 'pd fd 50 \nrt 90 fd 20 \nrt 90 fd 20 \nrt 70 fd 15 \nlt 160 fd 18 \nrt 90 fd 25 \nrt 90 fd 18 \npu bk 28 rt 90 \n\n'],
  ['c', 'fd 50 rt 90 fd 20 \npd bk 20 \nrt 90 fd 50 \nlt 90 fd 25 pu fd 10 lt 90 \n\n'],
  ['d', 'pd fd 50 \nrt 90 fd 10 \nrt 60 fd 58 \nrt 120 fd 30 \nrt 180 pu fd 40 lt 90 \n\n'],
  ['e', 'pu fd 50 rt 90 fd 25 \npd bk 25 \nrt 45 fd 28 \nrt 135 fd 20 \nlt 90 fd 30 \nlt 90 fd 30 \npu fd 10 lt 90 \n\n'],
  ['f', 'pu fd 50 rt 90 fd 25 \npd bk 25 \nrt 90 fd 12 \nlt 45 fd 12 \nrt 135 fd 9 \nlt 90 fd 30 \nlt 90 pu fd 35 lt 90 \n\n'],
  ['g', 'pu fd 50 rt 90 fd 20 \npd bk 20 \nrt 90 fd 50 \nlt 90 fd 25 lt 90 fd 25 \nlt 90 fd 10 \npu bk 10 rt 90 bk 25 \nrt 90 fd 10 lt 90 \n\n'],
  ['h', 'pu fd 50 pd bk 50 \nrt 15 fd 27 \nrt 75 fd 10 \nlt 75 fd 25 \nrt 165 fd 50 \nlt 90 pu fd 10 lt 90 \n\n'],
  ['i', 'pd fd 50 \npu bk 50 rt 90 fd 10 lt 90 \n\n'],
  ['j', 'pu fd 30 \npd bk 15 \nlt 45 bk 20 \nrt 45 fd 50 \npu bk 50 rt 90 fd 10 lt 90 \n\n'], 
  ['k', 'pu fd 50 \npd bk 50 \nrt 25 fd 50 \nrt 170 fd 25 \nlt 50 fd 27 \npu lt 55 fd 10 lt 90 \n\n'],
  ['l', 'pu fd 50 pd bk 50 \nrt 90 fd 25 \nlt 90 fd 10 \npu bk 10 rt 90 fd 10 lt 90 \n\n'],
  ['m', 'pd fd 50 \nrt 90 fd 10 \nrt 45 fd 20 \nlt 90 fd 20 \nrt 135 fd 50 \npu lt 90 fd 10 lt 90 \n\n'],
  ['n', 'pd fd 50 \nrt 90 fd 10 \nrt 70 fd 53 \nlt 160 fd 50 \npu bk 50 rt 90 fd 10 lt 90 \n\n'],
  ['o', 'pd fd 42 rt 45 fd 12 rt 45 \nfd 20 rt 90 fd 42 rt 45 fd 12 \nrt 45 fd 20 rt 180 \npu fd 38 lt 90 \n\n'],
  ['p', 'pd fd 30 \nrt 90 fd 30 \nlt 90 fd 20 \nlt 90 fd 30 \npu lt 90 fd 50 \nlt 90 fd 40 lt 90 \n\n'],
  ['q', 'pd fd 42 rt 45 fd 12 rt 45 \nfd 20 rt 90 fd 42 lt 45 fd 12 \nrt 135 pu fd 10 pd fd 26 \npu bk 46 rt 90 \n\n'],
  ['r', 'pd fd 50 \nrt 90 fd 30 \nrt 90 fd 20 \nrt 90 fd 20 \nlt 130 fd 40 \nlt 50 pu fd 10 lt 90 \n\n'], 
  ['s', 'pu fd 50 rt 90 fd 20 \nrt 135 pd fd 27 \nlt 135 fd 30 \nrt 135 fd 44 \nlt 135 pu fd 40 lt 90 \n\n'],
  ['t', 'pu fd 50 rt 90 \nfd 30 pd bk 30 \nrt 15 fd 15 \nrt 75 fd 48 \npu lt 90 fd 25 lt 90 \n\n'],
  ['u', 'pu fd 50 \nrt 180 pd fd 42 \nlt 45 fd 12 \nlt 45 fd 20 \nlt 90 fd 50 \npu bk 50 rt 90 fd 10 lt 90 \n\n'],
  ['v', 'pu fd 50 pd rt 90 fd 5 \nrt 70 fd 53 \nlt 140 fd 53 \npu rt 70 fd 10 lt 90 bk 50 \n\n'],
  ['w', 'pu fd 50 pd bk 50 \nrt 45 fd 20 \nrt 90 fd 20 \nlt 45 fd 10 \nlt 90 fd 50 \npu rt 90 fd 10 lt 90 bk 50 \n\n'],
  ['x', 'pu fd 50 rt 90 fd 10 \nrt 60 pd fd 15 \nlt 110 fd 18 \nrt 170 fd 58 \nlt 170 fd 36 \nrt 110 fd 32 \npu lt 60 fd 10 lt 90 \n\n'],
  ['y', 'pu fd 50 \nrt 90 pd fd 5 \nrt 60 fd 20 \nlt 110 fd 24 \nrt 165 fd 56 \npu lt 115 fd 34 lt 90 \n\n'], 
  ['z', 'pu fd 50 \nrt 90  fd 8 pd fd 30 \nrt 130 fd 56 \nlt 40 fd 8\nlt 90 fd 40 \npu fd 10 lt 90 \n\n']
]);

document.getElementById('editor').oninput = e => {
  let code = e.target.value.replace(/\n/g, " ");
  if (code.startsWith('#') && code.endsWith('#') && code.length > 2) {
    runSnippet(code);
    return;
  }
  if (code.startsWith('#')) return;
  updateViewport(code);
};

function runSnippet(code) {
  let writable = code.substring(1, code.length-1).toLowerCase();
  let newCode = 'setxy -280 -200 \n\n';
  for (let c of writable) {
    if (alphaMap.has(c)) newCode += alphaMap.get(c);
  }
  newCode += 'ht \n';
  runExample(newCode);
}

document.getElementById('fd-run').onclick = () => runExample('fd 60');
document.getElementById('bk-run').onclick = () => runExample('bk 50');
document.getElementById('rt-run').onclick = () => runExample('rt 90 \nfd 50');
document.getElementById('lt-run').onclick = () => runExample('lt 30 \nfd 50');
document.getElementById('pupd-run').onclick = () => runExample(
  'rt 90 fd 20 \npu fd 20 \npd fd 20 \npu fd 20 \npd fd 20 \npu fd 20 \npd fd 20');
document.getElementById('ht-run').onclick = () => runExample('fd 50 rt 90 fd 50 \nht');
document.getElementById('home-run').onclick = () => runExample(
  'rt 90 pu fd 50 pd repeat 3 [fd 50 lt 120] \nhome');
document.getElementById('setxy-run').onclick = () => runExample(
  'rt 90 pu fd 50 pd repeat 3 [fd 50 lt 120] \nsetxy 200 -150');
document.getElementById('repeat-run').onclick = () => runExample(
  'setxy -150 -45 repeat 4 [fd 90 rt 90] \nsetxy 60 0 repeat 360 [fd 1 rt 1]');
// kool examples
document.getElementById('four-leaf-run').onclick = () => runExample(
  'repeat 4 [repeat 72 [fd 20 rt 10] rt 90]');
document.getElementById('hypercube-run').onclick = () => runExample(
  'setxy -110 50 \nrepeat 8 [repeat 4 [rt 90 fd 100] bk 100 lt 45] \nht');
document.getElementById('penta-star-run').onclick = () => runExample(
  'setxy 0 -40 \nrepeat 5 [repeat 6 [fd 100 lt 72] lt 144] \nht');
document.getElementById('dahlia-run').onclick = () => runExample(
  'setxy -100 -30 \nrepeat 8 [rt 45 repeat 6 [repeat 90 [fd 3 rt 2] rt 90]] \nht');
document.getElementById('fflower-run').onclick = () => runExample(
  'setxy -20 120 \nrepeat 12 [repeat 75 [fd 100 bk 100 rt 2] fd 250]');
document.getElementById('mrose-run').onclick = () => runExample(
  'repeat 36 [lt 10 pu fd 2 pd repeat 120 [fd 5 rt 3]] \nht');
document.getElementById('chakra-run').onclick = () => runExample(
  'setxy -60 40 \nrepeat 25 [repeat 15 [fd 100 bk 100 rt 5] fd 100]');
document.getElementById('ninja-star-run').onclick = () => runExample(
  'setxy 0 -165 \nrepeat 12 [repeat 50 [fd 75 bk 70 rt 2] rt 180] \nht');
document.getElementById('polygons-run').onclick = () => runExample(
  'setxy -130 -20 \nrepeat 4 [repeat 30 [lt 90 fd 4 rt 90 fd 4] rt 90] \n' 
  + 'setxy 220 30 \nrepeat 4 [repeat 20 [lt 160 fd 20 rt 160 fd 20] rt 90] \n' 
  + 'setxy 50 -200 \nrepeat 8 [repeat 20 [lt 170 fd 20 rt 170 fd 20] rt 45]');

document.getElementById('snippet-run').onclick = () => runSnippet('#premjit#');

function runExample(example) {
  document.getElementById('editor').value = example;
  updateViewport(example.replace(/\n/g, " "));
}

function updateViewport(code) {
  try {
    let lexer = new LogoLexer(code);
    let parser = new LogoParser(lexer);
    let ast = parser.parse();
    bus.dispatch("ControlLIce", { ast });
  } catch (error) {
    console.log('Was not parsable');
    console.log(error);
  }
}