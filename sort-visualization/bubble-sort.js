class BubbleSort extends BaseSort {

  constructor(mode) {
    super(SketchColor.green().stringify(), (mode == BaseSort.STEP_MODE ? 8 : 1));
    this._i = 0;
    this._j = 0;
    this._mode = mode;
  }

  sort() {
    this._swap_a = -1;
    this._swap_b = -1;
    if (this._mode == BaseSort.STEP_MODE) 
      this.sortStep();
    else
      this.sortLoop();
  }

  sortStep() {
    if (this._array[this._j] > this._array[this._j+1]) {
      this.swap(this._j, this._j+1);
      this._swap_a = this._j;
      this._swap_b = this._j+1;
    }
    if (this._i < this._array.length) {
      this._j++;
      if (this._j >= (this._array.length-this._i-1)) {
        this._j = 0;
        this._i++;
      }
    }
  }

  sortLoop() {
    for (; this._j<this._array.length-this._i-1; this._j++) {
      if (this._array[this._j] > this._array[this._j+1]) {
        this.swap(this._j, this._j+1);
      }
    }
    if (this._j >= (this._array.length-this._i-1)) {
      this._j=0;
      this._i++;
    }
  }

  getColor(index) {
    if (index == this._i || index == this._j) 
      return SketchColor.blue().stringify();
    if (index == this._swap_a || index == this._swap_b) 
      return SketchColor.greenyellow().stringify();
    return this._mode == BaseSort.STEP_MODE ? 
        SketchColor.grey().stringify() : SketchColor.white().stringify();
  }

}