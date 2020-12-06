class DNA {

  constructor(order, cities, mutationRate) {
    this._order = order;
    this._cities = cities;

    // needs to be set by the GA algorithm using calculateCurrentTotal(this._order)
    // immediately after construction
    this._dist = 0;
    this._fitness = 0;
    this._route;

    this._mutationRate = mutationRate ? mutationRate : 0.5;
  }

  // static create = cities => 
  //   new DNA(shuffle([...Array(cities.length).keys()]), cities);

  static create = (cities, mutationRate) => 
    new DNA(shuffle([...Array(cities.length).keys()]), cities, mutationRate);
  
  /**
   * Randomly pick 1 vertex and Swap with the next one
   */
  mutate() {
    let newOrder = this._order.slice();
    for (let i=0; i<newOrder.length; i++) {
      if (random(1) < this._mutationRate) {
        let j = floor(random(newOrder.length));
        let tmp = newOrder[i];
        newOrder[i] = newOrder[j];
        newOrder[j] = tmp;
      }
    }
    let dna = new DNA(newOrder, this._cities, this._mutationRate);
    return dna;
  }

  getRoute() {
    if (!this._route) {
      this._route = [];
      for (let i = 0; i < this._order.length - 1; i++) {
        this._route.push(new TspPath(
          this._cities[this._order[i]], 
          this._cities[this._order[i+1]]));
      }
      this._route.push(new TspPath(
        this._cities[this._order[this._order.length - 1]], 
        this._cities[this._order[0]]));
    }
    return this._route;
  }

}