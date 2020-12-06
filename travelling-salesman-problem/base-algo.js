class BaseAlgo {

  constructor(param, calculateLoopCountMax) {
    this._param = param;
    this._calculated = false;
    this._calculatedLoopCount = 0;
    this._calculateLoopCountMax = calculateLoopCountMax;
  }
  
  run() {
    if (this._calculated) return;
    
    this._calculatedLoopCount++;
    if (this._calculatedLoopCount == this._calculateLoopCountMax) {
      this.calulateNextRoute();
      this._calculatedLoopCount = 0;
    }
  }

  calculateCurrentTotal(currentOrder) {
    let sum = 0;
    for (let i=0; i<currentOrder.length-1; i++) 
      sum += this._param.distances[currentOrder[i]][currentOrder[i+1]];
    if (currentOrder.length == this._param.cities.length) 
      sum += this._param.distances[currentOrder[currentOrder.length-1]][currentOrder[0]];
    return sum;
  }
}