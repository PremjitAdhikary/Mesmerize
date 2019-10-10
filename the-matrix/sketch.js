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
    if (streams[18+i].start() > symbolPremjit[i]._y)
      symbolPremjit[i].setVisibility(true);
    if (streams[23+i].start() > symbolPremjit[4+i]._y)
      symbolPremjit[4+i].setVisibility(true);
  }
}

function init() {
  codeSetAssamese = floor(random(1,3)) == 1;
  codeSet = codeSetAssamese ? {start: 0x0980, len: 128} : {start: 0x30A0, len: 96};
  resetTo = codeSetAssamese ? -2000 : 0;
  streams = [];
  console.log(width/Symbol.SIZE);
  for (let i=0; i < width/Symbol.SIZE; i++) {
    streams.push(new Stream(i*Symbol.SIZE, codeSet.start, codeSet.len, resetTo));
  }

  if (codeSetAssamese) {
    symbolPremjit = [];
    symbolPremjit.push(createAssameNameSymbol(18*Symbol.SIZE, charPre));
    symbolPremjit.push(createAssameNameSymbol(19*Symbol.SIZE+4, charM));
    symbolPremjit.push(createAssameNameSymbol(20*Symbol.SIZE, charJi));
    symbolPremjit.push(createAssameNameSymbol(21*Symbol.SIZE+4, charT));
    symbolPremjit.push(createAssameNameSymbol(23*Symbol.SIZE+1, charA));
    symbolPremjit.push(createAssameNameSymbol(24*Symbol.SIZE+2, charDhi));
    symbolPremjit.push(createAssameNameSymbol(25*Symbol.SIZE, charKa));
    symbolPremjit.push(createAssameNameSymbol(26*Symbol.SIZE+2, charRy));
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