class Stream {

  constructor(x, charCodes, resetTo) {
    this._symbols = new Array(floor(random(1,(height/Symbol.SIZE)-18)));
    let speed = random(2,4);
    let initY = random(-500, 0);
    for(let i=this._symbols.length-1; i>=0; i--) {
      let colorBright = (i==0 && floor(random(1,3)) == 1);
      this._symbols[i] = new Symbol(
        x,
        initY - (i * (Symbol.SIZE+15)),
        charCodes,
        colorBright ? Symbol.COLOR_BRIGHT : Symbol.COLOR_DIM,
        speed,
        resetTo
      );
    }
  }

  show() {
    this._symbols.forEach(s => s.show());
  }

  start() {
    return this._symbols[0]._y;
  }
  
}