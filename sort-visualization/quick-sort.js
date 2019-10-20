/**
 * Journey from a recursive quicksort to iterative and then this version.
 * 
 * Original QuickSort Algorithm: (from wikipedia)
 * *****************************
 * algorithm quicksort(A, lo, hi) is
 *   if lo < hi then
 *     p := partition(A, lo, hi)
 *     quicksort(A, lo, p - 1)
 *     quicksort(A, p + 1, hi)
 * 
 * algorithm partition(A, lo, hi) is
 *   pivot := A[hi]
 *   i := lo
 *   for j := lo to hi do
 *     if A[j] < pivot then
 *       swap A[i] with A[j]
 *       i := i + 1
 *   swap A[i] with A[hi]
 *   return i
 * 
 * Iterative version: (found on geeksforgeeks)
 * ******************
 * The idea is to replace the recursive calls using stacks to track the lo and hi
 * 
 * algorithm quicksort(A, lo, hi) is
 *   stack := new stack(hi-lo+1)
 *   top := -1
 *   stack[++top] := lo
 *   stack[++top] := hi
 *   while (top >= 0)
 *     hi := stack[top--]
 *     lo := stack[top--]
 *     p := partition(A, lo, hi) // partition algo remains the same
 *     if (p - 1 > lo) 
 *       stack[++top] := lo
 *       stack[++top] := p-1
 *     if (p + 1 < hi) 
 *       stack[++top] := p+1
 *       stack[++top] := hi
 * 
 * By expanding partition inside quicksort, we have a 'for' loop nested inside the 'while' loop.
 * We remove the outer while and change the inner for loop into a while. Following code shows how.
 * 
 * let sTop = -1;
 * let l=0;
 * let h=arr.length-1;
 * let stack = new Array(arr.length);
 * stack[++sTop] = l;
 * stack[++sTop] = h;
 * 
 * function quickSortIterative() {
 *   if (sTop <= 0) return;
 *   h = stack[sTop--];
 *   l = stack[sTop--];
 *   let x = arr[h];
 *   let i = l-1;
 *   let j=l;
 *   while (j<=h-1) {
 *     if (arr[j] <= x) {
 *       i++;
 *       swap(i,j);
 *     }
 *     j++;
 *   }
 *   swap(i+1,h);
 *   let p = i+1;
 *   if (p-1>l) {
 *     stack[++sTop] = l;
 *     stack[++sTop] = p-1;
 *   }
 *   if (p+1<h) {
 *     stack[++sTop] = p+1;
 *     stack[++sTop] = h;
 *   }
 * }
 * 
 * while(sTop > 0) quickSortIterative(arr); // this will start the sort
 * 
 * From here, another shift to get rid of the inner most while and we have this...
 */
class QuickSort extends BaseSort {

  constructor() {
    super(SketchColor.green().stringify(), 2);
    this._sortRun = true;
    this._sTop = -1;
    this._l = 0;
    this._h = this._array.length-1;
    this._stack = new Array(this._array.length);
    this._x = this._array[this._h];
    this._i = this._l-1;
    this._j = this._l;
  }

  sort() {
    if (!this._sortRun) return;

    if (this._j <= this._h-1) {
      if (this._array[this._j] <= this._x) {
        this._i++;
        this.swap(this._i, this._j);
      }
      this._j++;
    }

    if (this._j > this._h-1) {
      this.swap(this._i+1, this._h);
      let p = this._i+1;
      if (p+1 < this._h) {
        this._stack[++this._sTop] = p+1;
        this._stack[++this._sTop] = this._h;
      }
      if (p-1 > this._l) {
        this._stack[++this._sTop] = this._l;
        this._stack[++this._sTop] = p-1;
      }

      if (this._sTop <= 0) {
        this._sortRun = false;
        this._i = -1;
        this._j = -1;
        this._l = -1;
        this._h = -1;
        return;
      }
      this._h = this._stack[this._sTop--];
      this._l = this._stack[this._sTop--];
      this._x = this._array[this._h];
      this._i = this._l-1;
      this._j = this._l;
    }
  }

  getColor(index) {
    if (index == this._l || index == this._h || index == this._i || index == this._j) 
      return SketchColor.red().stringify();
    return SketchColor.white().stringify();
  }
}