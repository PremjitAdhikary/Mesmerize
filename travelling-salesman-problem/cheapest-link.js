/**
 * This too, Java to Javascript.
 * 
 * At first I thought to visualize the picking of the cheapest edge. But that really made the 
 * visualization really long and boring.
 * 
 * So sort the edges, then cherry pick and show.
 */
class CheapestLink extends BaseAlgo {

  constructor(param) {
    super(param, 8);
    this._totalTestedEdges = this._param.cities.length * (this._param.cities.length - 1) / 2;

    this.initializeIndices();
    this._lockedEdges = [];
    this._bestTotal = 0;
  }

  initializeIndices() {
    this._sortedEdges = [];
    for (let r = 0; r < this._param.cities.length - 1; r++) {
      for (let c = r+1; c < this._param.cities.length; c++) {
        this._sortedEdges.push(createVector(r, c));
      }
    }
    this._sortedEdges.sort(
      (a, b) => this._param.distances[a.x][a.y] - this._param.distances[b.x][b.y]);
    this._currentSortedEdgesIndex = 0;
    
    // this keeps a count of all edges a vertex belongs to in the best path
    this._verticesCount = [];
    for (let i=0; i<this._param.cities.length; i++) this._verticesCount.push(0);
    
    // if an edge (u-v) is selected to be in best path, then this._lockedEdgesMarked[u][v] and 
    // this._lockedEdgesMarked[v][u] are set to true
    // assissts in figuring out cycles
    this._lockedEdgesMarked = create2DArray(this._param.cities.length, this._param.cities.length);
    forEach2DArray(this._lockedEdgesMarked, (arr, r, c) => this._lockedEdgesMarked[r][c] = false );
  }

  calulateNextRoute() {
    this.updateMessage();
    if (this._lockedEdges.length >= this._param.cities.length) {
      this._calculated = true;
      return;
    }

    this.addEdge();
    this.lockIfBestEdge();
    this._currentSortedEdgesIndex++;
  }

  addEdge() {
    let selectedEdge = this._sortedEdges[this._currentSortedEdgesIndex];
    this._param.testRoute.push(new TspPath(
      this._param.cities[selectedEdge.x], this._param.cities[selectedEdge.y]
      ));
    let currentDist = this._param.distances[selectedEdge.x][selectedEdge.y];
    this._param.testRouteMessage = 'Current Edge: ' + currentDist.toFixed(1);
  }

  lockIfBestEdge() {
    if (this.isBestEdge()) {
      this.lockBestEdge();
    }
  }

  /**
   * Checks if new edge causes any vertex to be part of 3 edges
   * 
   * Checks if new edge doesnt cause a smaller cycle
   */
  isBestEdge() {
    let selectedEdge = this._sortedEdges[this._currentSortedEdgesIndex];
    let causes3EdgeFrom1Vertex = (this._verticesCount[selectedEdge.x] == 2 
      || this._verticesCount[selectedEdge.y] == 2);
    if (causes3EdgeFrom1Vertex) return false;
    
    this.markLockedEdges(selectedEdge.x, selectedEdge.y, true);
    let visited = [];
    for (let i=0; i<this._param.cities.length; i++) visited.push(false);
    let causesCircuit = this.hasCycle(selectedEdge.x, visited, -1);
    let smallerCircuit = visited.some(v => !v);
    if (causesCircuit && smallerCircuit) {
      this.markLockedEdges(selectedEdge.x, selectedEdge.y, false);
      return false;
    }
    return true;
  }

  markLockedEdges(u, v, val) {
    this._lockedEdgesMarked[u][v] = val;
    this._lockedEdgesMarked[v][u] = val;
  }

  /**
   * Recursive function to identify cycles in a graph
   */
  hasCycle(u, visited, parent) {
    visited[u] = true;
    for (let v of this.findAllVsFromSelectedEdgesFor(u)) {
      if (!visited[v]) {
        if (this.hasCycle(v, visited, u)) {
          return true;
        }
      } else if (v != parent) {
        return true;
      }
    }
    return false;
  }

  findAllVsFromSelectedEdgesFor(u) {
    let allVs = [];
    for (let i=0; i<this._param.cities.length; i++) {
      if (this._lockedEdgesMarked[u][i])
        allVs.push(i);
    }
    return allVs;
  }

  lockBestEdge() {
    let selectedEdge = this._sortedEdges[this._currentSortedEdgesIndex];
    this._lockedEdges.push(
      createVector(selectedEdge.x, selectedEdge.y));
    
    this._verticesCount[selectedEdge.x]++;
    this._verticesCount[selectedEdge.y]++;
    
    this._param.bestRoute.push(new TspPath(
      this._param.cities[selectedEdge.x], 
      this._param.cities[selectedEdge.y]
    ));
    
    let currentDist = this._param.distances[selectedEdge.x][selectedEdge.y];
    this._bestTotal += currentDist;
    this._param.bestRouteMessage = 'Best Route Total: ' + this._bestTotal.toFixed(1);
  }

  updateMessage() {
    this._param.messages = [];
    this._param.messages.push('Best Edges Found: ' 
      + this._lockedEdges.length + ' / ' + this._param.cities.length);
    this._param.messages.push('Edges Tested: ' 
      + this._param.testRoute.length + ' / ' + this._totalTestedEdges);
  }

}