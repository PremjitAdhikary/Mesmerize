/**
 * Another recursive to iterative and then p5js special version where every show() increments 
 * the smallest loop.
 * 
 * The iterative version was found in wikipedia:
 * 
 * merge_sort(A, W, n) {
 *   for (width = 1; width < n; width = 2 * width) {
 *     for (i = 0; i < n; i = i + 2 * width) {
 *       merge(A, i, min(i + width, n), min(i + 2 * width, n), W)
 *     }
 *     copy(W, A)
 *   }
 * }
 * 
 * merge(A, begin, mid, end, W) {
 *   left = begin
 *   right = mid
 *   for (j = begin; j < end; j++) {
 *     if (left < mid && (right >= end || A[left] <= A[right]))
 *       W[j] = A[left]
 *     else
 *       W[j] = A[right]
 *   }
 * }
 * 
 * The above is turned inside out to react to show() where sort() is called
 */
class MergeSort extends BaseSort {

  constructor() {
    super(SketchColor.green().stringify(), 2);
    this._inputArray;
    this._workerArray = new Array(width/this._strokeWid);
    this._inputArray = new Array(width/this._strokeWid);
    this.copyArray(this._array, this._workerArray);
    this.copyArray(this._array, this._inputArray);

    this._width = 1;
    this._outerMergeLoop = 0;
    this._innerMergeLoop = 0;
    this._begin = this._outerMergeLoop;
    this._mid = this._outerMergeLoop+this._width;
    this._end = this._outerMergeLoop+this._width*2;
    this._left = this._begin;
    this._right = this._mid;
  }

  sort() {
    if (this._width >= this._array.length*2) { // multiplied by 2 to accomodate for the last run
      this._begin = -1;
      this._end = -1;
      this._innerMergeLoop = -1;
      return;
    }
    if (this._outerMergeLoop >= this._array.length) {
      this.copyArray(this._workerArray, this._inputArray);
      this.copyArray(this._workerArray, this._array);
      this._outerMergeLoop = 0;
      this._width *= 2;
    } else if (this._innerMergeLoop >= this._end) {
      this._begin = this._outerMergeLoop;
      this._mid = Math.min(this._outerMergeLoop+this._width, this._inputArray.length);
      this._end = Math.min(this._outerMergeLoop+this._width*2, this._inputArray.length);
      this._innerMergeLoop = this._begin;
      this._left = this._begin;
      this._right = this._mid;
      this._outerMergeLoop = this._outerMergeLoop + this._width * 2;
    } else {
      this._workerArray[this._innerMergeLoop] = 
        (this._left < this._mid 
          && (this._right >= this._end || this._inputArray[this._left] <= this._inputArray[this._right])) 
          ? this._inputArray[this._left++] : this._inputArray[this._right++];
      this.copyArray(this._workerArray, this._array);
      this._innerMergeLoop++;
    }
  }

  copyArray(source, destination) {
    for (let i=0; i<source.length; i++)
      destination[i] = source[i];
  }

  getColor(index) {
    if (index == this._innerMergeLoop) 
      return SketchColor.red().stringify();
    if (index >= this._begin && index <= this._end) 
      return SketchColor.green().stringify();
    return SketchColor.white().stringify();
  }

}