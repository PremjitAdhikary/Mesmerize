class SelectionSort extends BaseSort {

  constructor(mode) {
    super(SketchColor.green().stringify(), (mode == 0 ? 8 : 1));
    this._i = 0;
    this._j = 1;
    this._jMin = 0;
    this._swapStep = false;
    this._mode = mode;
  }

  sort() {
    this._swap_a = -1;
    this._swap_b = -1;
    if (this._mode == 0) 
      this.sortStep();
    else
      this.sortLoop();
  }

  sortStep() {
    if (this._i >= this._array.length) {
      return;
    }

    if (this._array[this._j] < this._array[this._jMin]) this._jMin = this._j;
    this._j++;
    if (this._j >= this._array.length) {
      if (this._jMin != this._i) {
        this.swap(this._i, this._jMin);
        this._swap_a = this._i;
        this._swap_b = this._jMin;
      }
      this._i++;
      this._j = this._i+1;
      this._jMin = this._i;
    }
  }

  sortLoop() {
    if (this._i >= this._array.length) {
      this._jMin = -1;
      return;
    }

    this._jMin = this._i;
    for (this._j=this._i+1; this._j<this._array.length; this._j++) {
      if (this._array[this._j] < this._array[this._jMin]) 
        this._jMin = this._j;
    }
    if (this._jMin != this._i) {
      this.swap(this._i, this._jMin);
      this._swap_a = this._i;
      this._swap_b = this._jMin;
    }
    if (this._j >= this._array.length) {
      this._j=0;
      this._i++;
    }
  }

  getColor(index) {
    if (index == this._i || index == this._j) 
      return SketchColor.blue().stringify();
    if (index == this._swap_a || index == this._swap_b) 
      return SketchColor.greenyellow().stringify();
    if (index == this._jMin) 
      return SketchColor.red().stringify();
    return this._mode == 0 ? SketchColor.grey().stringify() : SketchColor.white().stringify();
  }

}