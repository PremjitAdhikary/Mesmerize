/**
 * For this too I had written a Java implementation.
 * 
 * This was easy to port as the Java version was also iterative.
 */
class NearestNeighbor extends BaseAlgo {

  constructor(param, showSteps, calculateLoopCountMax) {
    super(param, calculateLoopCountMax);
    this._showSteps = showSteps;
    this._currentStartIndex = 0;
    this.initializeIndices();
    this._lockedEdges = 0;
    this._removeLastDrawnEdge = false;
    this._currentTestCount = 0;
    this._totalTests = Math.pow(this._param.cities.length, 2);
  }

  initializeIndices() {
    this._visited = [];
    for (let i=0; i<this._param.cities.length; i++) this._visited.push(false);
    this._currentIndex = this._currentStartIndex;
    this._visited[this._currentIndex] = true;
    this._testDistancesTotal = 0;
    this.resetIndices();
  }

  resetIndices() {
    this._nextIndex = -1;
    this._nextDist = Number.MAX_VALUE;
    this._checkIndex = 0;
  }

  calulateNextRoute() {
    this.updateMessage();

    if (this._visited.every( v => v )) {
      this.closeRouteAndUpdateBestRoute();
      return;
    }

    if (this._checkIndex >= this._visited.length) {
      this.lockBestEdgeAndReset();
      return;
    }

    if (this._showSteps) {
      this.checkEdge();
      this._checkIndex++;
    } else {
      for (; this._checkIndex < this._visited.length; this._checkIndex++)
        this.checkEdge();
    }
  }

  closeRouteAndUpdateBestRoute() {
    this.addEdge(this._currentIndex, this._currentStartIndex, false);
    this._testDistancesTotal += this._param.distances[this._currentIndex][this._currentStartIndex];
    this._param.testRouteTotal = this._testDistancesTotal;
    this._param.bestRoute = [];
    this._param.testRoute.forEach(edge => this._param.bestRoute.push(edge));
    this._calculated = true;
    this._param.testRouteMessage = 'Test Route Total: ' + this._testDistancesTotal.toFixed(1);
    this._param.bestRouteMessage = 'Best Route Total: ' + this._testDistancesTotal.toFixed(1);
  }

  lockBestEdgeAndReset() {
    this.addEdge(this._currentIndex, this._nextIndex, false);
    this._currentIndex = this._nextIndex;
    this._visited[this._currentIndex] = true;
    this._testDistancesTotal += this._nextDist;
    this.resetIndices();
  }

  checkEdge() {
    if (this._checkIndex == this._currentIndex || this._visited[this._checkIndex]) 
      return;
      
    this.addEdge(this._currentIndex, this._checkIndex, true);
    let selectedEdgeDist = this._param.distances[this._currentIndex][this._checkIndex];
    if (selectedEdgeDist < this._nextDist) {
      this._nextDist = selectedEdgeDist;
      this._nextIndex = this._checkIndex;
    }
  }

  addEdge(u, v, removeDrawnEdgeNext) {
    if (this._removeLastDrawnEdge) 
      this._param.testRoute.pop();
    
    this._param.testRoute.push(new TspPath(
      this._param.cities[u], this._param.cities[v]
    ));

    this._removeLastDrawnEdge = removeDrawnEdgeNext;
  }

  updateMessage() {
    this._currentTestCount++;
    this._param.messages = [];
    let percentage = this._currentTestCount / this._totalTests * 100;
    this._param.messages.push('Neighbors Tested: ' + percentage.toFixed(10) + '%');
    this._param.testRouteMessage = 'Test Route Total: ' + this._testDistancesTotal.toFixed(1);
    this._param.bestRouteMessage = 'Best Route Total: Not Calculated';
  }

}