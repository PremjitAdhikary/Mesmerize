/**
 * Another easy Java implementation port into Javascript
 */
class RepetitiveNearestNeighbor extends BaseAlgo {

  constructor(param) {
    super(param, 1);
    this._currentStartIndex = 0;
    this._totalTests = Math.pow(this._param.cities.length, 2) * (this._param.cities.length + 1);
    this._currentAlgoParam;
    this._currentAlgo;
    this._bestTotal = Number.MAX_VALUE;
    this.initiateCurrentAlgo();
    this._param.bestRouteMessage = 'Best Route Total: Not Calculated';
  }

  initiateCurrentAlgo() {
    this._currentAlgoParam = {
      cities: this._param.cities,
      distances: this._param.distances,
      bestRoute: [],
      testRoute: [],
      messages: [],
      testRouteMessage: '',
      bestRouteMessage: ''
    };
    this._currentAlgo = new NearestNeighbor(this._currentAlgoParam, false, 5);
    this._currentAlgo._currentStartIndex = this._currentStartIndex;
    this._currentAlgo.initializeIndices();
  }

  calulateNextRoute() {
    this.updateMessage();

    if (this._currentStartIndex >= this._param.cities.length) {
      this._calculated = true;
      return;
    }

    if (this._currentAlgo._calculated) {
      if (this._currentAlgo._testDistancesTotal < this._bestTotal) {
        this._bestTotal = this._currentAlgo._testDistancesTotal;
        this._param.bestRoute = this._currentAlgo._param.bestRoute;
        this._param.bestRouteMessage = this._currentAlgoParam.bestRouteMessage;
      }
      this._currentStartIndex++;
      if (this._currentStartIndex < this._param.cities.length) {
        this.initiateCurrentAlgo();
      }
      return;
    }

    this._currentAlgo.run();
    this._param.testRoute = this._currentAlgoParam.testRoute;
    this._param.testRouteMessage = this._currentAlgoParam.testRouteMessage;
  }

  updateMessage() {
    this._param.messages = [];
    this._param.messages.push('Routes Tested: ' 
      + (this._currentStartIndex) + ' / ' + this._param.cities.length);
    this._param.testRouteMessage = this._currentAlgoParam.testRouteMessage;
  }
  
}