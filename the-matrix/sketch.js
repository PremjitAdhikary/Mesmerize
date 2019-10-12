let canvas;

let streams;
let codeSet; // Assamese, Katakana
let Katakana = [
  0x30A0,0x30A1,0x30A2,0x30A3,0x30A4,0x30A5,0x30A6,0x30A7,
  0x30A8,0x30A9,0x30AA,0x30AB,0x30AC,0x30AD,0x30AE,0x30AF,  
  0x30B0,0x30B1,0x30B2,0x30B3,0x30B4,0x30B5,0x30B6,0x30B7,
  0x30AB,0x30B9,0x30BA,0x30BB,0x30BC,0x30BD,0x30BE,0x30BF,
  0x30C0,0x30C1,0x30C2,0x30C3,0x30C4,0x30C5,0x30C6,0x30C7,
  0x30CB,0x30C9,0x30CA,0x30CB,0x30CC,0x30CD,0x30CE,0x30CF,
  0x30D0,0x30D1,0x30D2,0x30D3,0x30D4,0x30D5,0x30D6,0x30D7,
  0x30DB,0x30D9,0x30DA,0x30DB,0x30DC,0x30DD,0x30DE,0x30DF,
  0x30E0,0x30E1,0x30E2,0x30E3,0x30E4,0x30E5,0x30E6,0x30E7,
  0x30EB,0x30E9,0x30EA,0x30EB,0x30EC,0x30ED,0x30EE,0x30EF,
  0x30F0,0x30F1,0x30F2,0x30F3,0x30F4,0x30F5,0x30F6,0x30F7,
  0x30FB,0x30F9,0x30FA,0x30FB,0x30FC,0x30FD,0x30FE,0x30FF
];
let Assamese = [
         0x0981,0x0982,0x0983,       0x0985,0x0986,0x0987,
  0x0988,0x0989,0x098A,0x098B,0x098C,              0x098F, 
  0x0990,              0x0993,0x0994,0x0995,0x0996,0x0997,
  0x0998,0x0999,0x099A,0x099B,0x099C,0x099D,0x099E,0x099F, 
  0x09A0,0x09A1,0x09A2,0x09A3,0x09A4,0x09A5,0x09A6,0x09A7,
  0x09A8,       0x09AA,0x09AB,0x09AC,0x09AD,0x09AE,0x09AF, 
  0x09B0,       0x09B2,                     0x09B6,0x09B7,
  0x09B8,0x09B9,              0x09BC,0x09BD,0x09BE,0x09BF, 
  0x09C0,0x09C1,0x09C2,0x09C3,0x09C4,              0x09C7,
  0x09C8,              0x09CB,0x09CC,0x09CD,0x09CE,         
                                                   0x09D7,
                              0x09DC,0x09CD,       0x09DF,  
  0x09E0,0x09E1,0x09E2,0x09E3,              0x09E6,0x09E7,
  0x09E8,0x09E9,0x09EA,0x09EB,0x09EC,0x09ED,0x09EE,0x09EF,  
  0x09F0,0x09F1,0x09F2,0x09F3,0x09F4,0x09F5,0x09F6,0x09F7,
  0x09F8,0x09F9,0x09FA,0x09FB 
];
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
  let codeSetAssamese = floor(random(1,3)) == 1;
  let charCodes = codeSetAssamese ? Assamese : Katakana;
  let resetTo = codeSetAssamese ? -2000 : 0;
  streams = [];
  for (let i=0; i < width/Symbol.SIZE; i++) {
    streams.push(new Stream(i*Symbol.SIZE, charCodes, resetTo));
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