/**
 * Basic Brute Force Version.
 * 
 * I have written a java version using recursion. But that would not work here considering the 
 * animation loop.
 * 
 * For this Daniel's video gave me all that I needed. The lexicographic ordering algorithm he 
 * got from Quora is simple to implement. Let P[1..n] is a permutation of 1 through n:
 * - Find the largest x such that P[x]<P[x+1].
 *   - If there is no such x, P is the last permutation
 * - Find the largest y such that P[x]<P[y].
 * - Swap P[x] and P[y].
 * - Reverse P[x+1 .. n].
 * 
 * Source: https://www.quora.com/How-would-you-explain-an-algorithm-that-generates-permutations-using-lexicographic-ordering
 */
class BruteForce extends BaseAlgo {

  constructor(param) {
    super(param, 1);
    this._permutation = [...Array(this._param.cities.length-1).keys()];
    this._currentPermutationCount = 1;
    this._totalPermutations = this.factorial(this._param.cities.length-1);
    this._currentTotal = 0;
    this._bestTotal = Number.MAX_VALUE;
  }

  calulateNextRoute() {
    this.updateMessage();

    this.updatePermutation();
    this.nextPermutation();
  }

  updatePermutation() {
    this._param.testRoute = [];
    for (let i = 0; i < this._permutation.length - 1; i++) 
      this._param.testRoute.push(new TspPath(
        this._param.cities[this._permutation[i]], 
        this._param.cities[this._permutation[i+1]]));
    this._param.testRoute.push(new TspPath(
      this._param.cities[this._permutation[this._permutation.length - 1]], 
      this._param.cities[this._permutation.length]));
    this._param.testRoute.push(new TspPath(
      this._param.cities[this._permutation.length], 
      this._param.cities[this._permutation[0]]));
    let distArray = [...this._permutation, this._permutation.length];
    this._currentTotal = this.calculateCurrentTotal(distArray);
    if (this._currentTotal < this._bestTotal) {
      this._bestTotal = this._currentTotal;
      this._param.bestRoute = [];
      this._param.testRoute.forEach(edge => this._param.bestRoute.push(edge));
    }
  }

  nextPermutation() {
    // step 1
    let largestI = -1;
    for (let i = 0; i < this._permutation.length-1; i++) {
      if (this._permutation[i] < this._permutation[i+1]) 
        largestI = i;
    }
    if (largestI == -1) {
      this._calculated = true;
    }

    // step 2
    let largestJ = -1;
    for (let j = 0; j < this._permutation.length; j++) {
      if (this._permutation[largestI] < this._permutation[j]) 
        largestJ = j;
    }

    // step 3
    this.swap(this._permutation, largestI, largestJ);

    //step 4
    let removed = this._permutation.splice(largestI + 1);
    removed.reverse();
    this._permutation.push(...removed);
    this._currentPermutationCount++;
  }

  swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  factorial(n) {
    let fact = 1
    for (let i=2; i<=n; i++) fact *= i;
    return fact;
  }

  updateMessage() {
    this._param.messages = [];
    let percentage = this._currentPermutationCount / this._totalPermutations * 100;
    this._param.messages.push('Routes Tested: ' + percentage.toFixed(10) + '%');
    this._param.testRouteMessage = 'Test Route Total: ' + this._currentTotal.toFixed(1);
    this._param.bestRouteMessage = 
      'Best Route Total: ' + (this._bestTotal == Number.MAX_VALUE ? 
        'MAX' : this._bestTotal.toFixed(1));
  }

}