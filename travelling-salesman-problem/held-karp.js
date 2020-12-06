/**
 * This is dynamic programming.
 * 
 * Instead of the recursive to down version implemented in java, the dp table is populated in a 
 * bottom up version here.
 * 
 * The table is of the form:
 * dp[setSize][endVertex] contains key-value map such that
 *   key: set of included vertices
 *   value: path with minimum distance from endVertex to startVertex with included vertices in it
 * 
 * So dp[0][3] will contain path from vertex 3 to starting vertex 0 with no vertices in between. 
 * That is just 1 path.
 * And dp[3][5] will contain all shortest paths from vertex 5 to starting vertex 0 with all 
 * combinations of paths including 3 vertices from remaning vertices.
 * 
 * The algorithm:
 * 
 * for (i in 0..n-1)
 *   dp[0][i] = [({}, C_i_0)]  // populate dp table for base case
 * 
 * for (setSize in 1..n-1)
 *   for (i in 0..n-1)
 *     dp[setSize][i] = min of all paths from i to each individual vertex in subset
 * 
 * return min of all paths from 0 to all paths where all other vertices are included
 * 
 * Source: https://en.wikipedia.org/wiki/Held%E2%80%93Karp_algorithm
 */
class HeldKarp extends BaseAlgo {

  constructor(param) {
    super(param, 1);
    this.initialize()
  }

  initialize() {
    this._dpTable = [];
    for (let i = 0; i < this._param.cities.length; i++) {
      let setMap = []; 
      for (let j = 0; j < this._param.cities.length; j++) {
        setMap.push(new Map());
      }
      this._dpTable.push(setMap);
    }

    this._baseCaseCalculated = false;
    this._baseCaseIndex = 1;

    this._tabluationDone = false;
    this._setSize = 1;
    this._tableVertex = 1;
    this._combinationIndex = 0;

    this._bestPathDist = Number.MAX_VALUE;
    this._bestPath = null;
    this._bestSearchIndex = 1;

    this._loopCounter = 0;
    let n = this._param.cities.length - 1;
    this._totalLoops = n + n*(Math.pow(2, n)-1) + n;
  }

  calulateNextRoute() {
    this._loopCounter++;
    this.updateMessage();
    if (!this._baseCaseCalculated) {
      this.calculateBaseCase();
      return;
    }
    
    if (!this._tabluationDone) {
      this.doTabulation();
      return;
    }

    this.findBest();
  }

  /**
   * Total iterations is (n-1)
   */
  calculateBaseCase() {
    let subPath = new SubPath(this._param, this._baseCaseIndex, 0);
    this._dpTable[0][this._baseCaseIndex].set(this.generateKey([]), subPath);

    this.showSubPath(subPath);

    this._baseCaseIndex++;
    if (this._baseCaseIndex >= this._param.cities.length) {
      this._baseCaseCalculated = true;
    }
  }

  /**
   * Fill up the DP table
   * Time Complexity = O(n * 2^n) 
   * How?
   * For each setsize starting from 1 to n-1, it runs for n-1 times
   * So Total Iterations = (n-1) * SUM(r=1...n-1) (n-1)Cr
   *   Now SUM(r=0...n-1) (n-1)Cr = 2^(n-1)
   * Total Iterations = (n-1) * (2^(n-1) - (n-1)C0)
   *    = (n-1) * (2^(n-1) - 1)
   * From the above,  TC = O(n * 2^n)
   */
  doTabulation() {
    if (this._combinationIndex == 0 && this._tableVertex == 1) {
      this._combinations = this.generateCombinations(this._setSize);
    }

    let combo = this._combinations[this._combinationIndex];

    if (!combo.includes(this._tableVertex)) {
      let bestDist = Number.MAX_VALUE;
      let bestC = -1;
      let bestSubPath;
      for (let c of combo) {
        let searchKey = this.generateKey(combo, c);
        let resultSubPath = this._dpTable[this._setSize-1][c].get(searchKey);
        let distIfResultSubPathIncluded = 
          this._param.distances[this._tableVertex][c] + resultSubPath._dist;
        if (distIfResultSubPathIncluded < bestDist) {
          bestDist = distIfResultSubPathIncluded;
          bestSubPath = resultSubPath;
          bestC = c;
        }
      }
      let subPath = new SubPath(this._param, this._tableVertex, bestC, bestSubPath);
      let comboStr = this.generateKey(combo);
      this._dpTable[this._setSize][this._tableVertex].set(comboStr, subPath);
      this.showSubPath(subPath);
    }
    this._combinationIndex++;

    if (this._combinationIndex >= this._combinations.length) {
      this._tableVertex++;
      this._combinationIndex = 0;
    }

    if (this._tableVertex >= this._param.cities.length) {
      this._setSize++;
      this._tableVertex = 1;
    }
    
    if (this._setSize >= this._param.cities.length) {
      this._tabluationDone = true;
    }
  }

  /**
   * Given a subset of included vertex, returns a string where every character is boolean 
   * representaion of wherether the vertex is included.
   * For example, lets say we have 6 cities in the tour with vertieces [0,1,2,3,4,5].
   * And the subset is [2,4,5]
   * Then the key will be fftftt
   * If excludeVertex is provided in the above example as 5
   * Then the key will be fftftf
   */
  generateKey(subset, excludeVertex) {
    let key = '';
    for (let i = 0, s = 0; i < this._param.cities.length; i++) {
      if (s < subset.length && i == subset[s]) {
        key += (!excludeVertex ? 't' : subset[s] == excludeVertex ? 'f' : 't');
        s++;
      } else {
        key += 'f';
      }
    }
    return key;
  }

  /**
   * From the last row of the populated table, we calculate the circuit with the smallest 
   * distance
   * Total iterations is (n-1)
   */
  findBest() {
    let subPath = 
      this._dpTable[this._param.cities.length-2][this._bestSearchIndex].values().next().value;
    let newPath = new SubPath(this._param, 0, this._bestSearchIndex, subPath);
    this.showSubPath(newPath);
    
    let totalDist = 
    this._param.distances[0][this._bestSearchIndex] + subPath._dist;
    if (totalDist < this._bestPathDist) {
      this._bestPathDist = totalDist;
      this._bestPath = newPath;
      this._param.bestRoute = this._bestPath._route;
      this._param.bestRouteMessage = 'Best Route Total: ' + newPath._dist.toFixed(1);
    }

    this._bestSearchIndex++;
    if (this._bestSearchIndex >= this._param.cities.length) {
      this._calculated = true;
    }
  }

  /**
   * Start with an initial combination. Then keep generating the next combination from the current 
   * one until all combinations are generated.
   * 
   * Source: https://www.baeldung.com/java-combinations-algorithm
   */
  generateCombinations(r) {
    let n = this._param.cities.length;
    let combinations = [];

    // initialize with lowest lexicographic combination
    let combination = Array.from({length: r}, (_, i) => i + 1);

    while (combination[r - 1] < n) {
      combinations.push(combination.slice());

      // generate next combination in lexicographic order
      let t = r - 1;
      while (t != 0 && combination[t] == n - r + t) 
        t--;
      combination[t]++;

      for (let i = t + 1; i < r; i++) 
        combination[i] = combination[i - 1] + 1;
    }

    return combinations;
  }

  showSubPath(subPath) {
    this._param.testRoute = subPath._route;
    this._param.testRouteMessage = 'Test Route Total: ' + subPath._dist.toFixed(1);
  }

  updateMessage() {
    this._param.messages = [];
    let percentage = this._loopCounter / this._totalLoops * 100;
    this._param.messages.push('Solution: ' + percentage.toFixed(10) + '%');
  }

}

class SubPath {

  constructor(params, u, v, append) {
    let newEdge = new TspPath(
      params.cities[u], 
      params.cities[v]);
    if (!append) {
      this._path = [u,v];
      this._dist = params.distances[u][v];
      this._route = [newEdge];
    } else {
      this._path = [u, ...append._path];
      this._dist = params.distances[u][v] + append._dist;
      this._route = [newEdge, ...append._route];
    }
  }

}