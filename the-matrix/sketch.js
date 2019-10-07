let canvas;

let streams;
let codeSet; // Assamese, Katakana
let codeSetAssamese;
let symbolPremjit;

let charPre = String.fromCharCode(0x09AA) + String.fromCharCode(0x09CD) + 
    String.fromCharCode(0x09B0) + String.fromCharCode(0x09C7);
let charM = String.fromCharCode(0x09AE);
let charJi = String.fromCharCode(0x099C)+String.fromCharCode(0x09BF);
let charT = String.fromCharCode(0x09CE);
let charA = String.fromCharCode(0x0985);
let charDhi = String.fromCharCode(0x09A7)+String.fromCharCode(0x09BF);
let charKa = String.fromCharCode(0x0995)+String.fromCharCode(0x09BE);
let charRy = String.fromCharCode(0x09F0)+String.fromCharCode(0x09C0);

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
  init();
}

function draw() {
  if (codeSetAssamese) {
    background(0);
  } else {
    background(0,100);
  }
  streams.forEach(s => s.show());
  if (symbolPremjit.length > 0) {
    symbolPremjit.forEach(s => s.show());
    toggleSymbolPremjit();
  }
}

function toggleSymbolPremjit() {
  for (let i=0; i<4; i++) {
    if (streams[2+i].start() > symbolPremjit[i]._y)
      symbolPremjit[i].setVisibility(true);
    if (streams[8+i].start() > symbolPremjit[4+i]._y)
      symbolPremjit[4+i].setVisibility(true);
  }
}

function init() {
  codeSetAssamese = floor(random(1,3)) == 1;
  codeSet = codeSetAssamese ? {start: 0x0980, len: 128} : {start: 0x30A0, len: 96};
  resetTo = codeSetAssamese ? -2000 : 0;
  streams = [];
  let gutter = width - (floor(width/Symbol.SIZE)*Symbol.SIZE);
  for (let i=0; i < 14; i++) {
    streams.push(new Stream(gutter+(width/Symbol.SIZE*i), codeSet.start, codeSet.len, resetTo));
  }

  if (codeSetAssamese) {
    symbolPremjit = [];
    symbolPremjit.push(createAssameNameSymbol((gutter+(width/Symbol.SIZE*2))-5, charPre));
    symbolPremjit.push(createAssameNameSymbol((gutter+(width/Symbol.SIZE*3)), charM));
    symbolPremjit.push(createAssameNameSymbol((gutter+(width/Symbol.SIZE*4))-5, charJi));
    symbolPremjit.push(createAssameNameSymbol((gutter+(width/Symbol.SIZE*5)+2), charT));
    symbolPremjit.push(createAssameNameSymbol((gutter+(width/Symbol.SIZE*8)), charA));
    symbolPremjit.push(createAssameNameSymbol((gutter+(width/Symbol.SIZE*9))-2, charDhi));
    symbolPremjit.push(createAssameNameSymbol((gutter+(width/Symbol.SIZE*10)), charKa));
    symbolPremjit.push(createAssameNameSymbol((gutter+(width/Symbol.SIZE*11)), charRy));
    symbolPremjit.forEach(s => s.setVisibility(false));
  } else {
    symbolPremjit = [];
  }
}

function createAssameNameSymbol(x, value) {
  return new FlickeringSymbol(
    x, height/2, 
    Symbol.COLOR_BRIGHT,
    value, true
  );
}

function mouseClicked() {
  if (mouseInCanvas()) {
    init();
  }
}