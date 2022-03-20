import { bus } from '../components/event-bus.js';

setBus(bus);

document.getElementById('editor').oninput = e => {
  let code = e.target.value.replace(/\n/g, " ");
  updateViewport(code);
};

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

function runExample(example) {
  document.getElementById('editor').value = example;
  updateViewport(example.replace(/\n/g, " "));
}

function updateViewport(code) {
  console.log(code);
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