class NearCar extends NearApp {

  constructor() {
    super('NearCar', '/location-based-services/img/app-icons/nearCar.png');
  }

  build() {
    super.build();
  }

  buildFind() {
    super.buildFind();
    
    let findBtn = document.createElement('div');
    findBtn.append(document.createTextNode('\u00A0\u00A0Find Me A Cab\u00A0\u00A0'));
    findBtn.classList.add('phn-btn');
    this.css(findBtn, { margin: '20px' } );
    findBtn.addEventListener('click', e => this.findCars());
    this._findHolder.appendChild(findBtn);
  }

  findCars() {
    this._tools.get('L').dom.click();
    if (!this._areaServiceAble) {
      this._foundCars = [];
      this.updateUI();
      return;
    }
    this._services.dispatchEvent('FindCars', { range: NearCar.QUERY_RANGE } );
    this._foundCarsCallback = 
      () => this._services.dispatchEvent('FindCars', { range: NearCar.QUERY_RANGE } );
  }

  selectDb(db) {
    let func = super.selectDb(db);
    return e => {
      this._foundCarsCallback = () => {};
      func(e);
    };
  }

  postBuild() {
    super.postBuild();
    this._foundCarsCallback = () => {};
    
    this._services.registerEvent('FoundCars', e => {
      let temp = e.foundCabs.filter(c => !c._hired);
      this._foundCars = [];
      temp.forEach( t => this._foundCars.push(t.stateCopy()) );
      this.updateUI();
      this._foundCarsCallback();
    });
  }

  updateLocation(e) {
    this._areaServiceAble = e.isLand;
    super.updateLocation(e);
    this._foundCarsCallback = () => {};
  }

  updateUI() {
    super.updateUI();
    this.markCars();
    this.updateFoundCars();
    this.updateList();
  }

  markCars() {
    if (!this._foundCars) {
      return;
    }

    let cx = this._canvas.getContext('2d');
    for (let car of this._foundCars) {
      let xOffset = car._x - this._pos.x, yOffset = car._y - this._pos.y;
      cx.beginPath();
      cx.arc(this.canvasWd()/2 + xOffset, this.canvasHt()/2 + yOffset, 2, 0, 2 * Math.PI);
      cx.fillStyle = NearBar.PUB_COLOR;
      cx.fill();
    }
  }

  updateFoundCars() {
    if (!this._foundCars) {
      return;
    }
    this._foundCars.forEach( c => c._dist = dist(this._pos.x, this._pos.y, c._x, c._y) );
  }

  updateList() {
    let infoSpan = (info, style) => {
      let span = document.createElement('span');
      span.append(document.createTextNode('\u00A0' + info + '\u00A0'));
      if (style) span.style = style;
      return span;
    };
    let infoHead = txt => {
      let infoDiv = document.createElement('div');
      this.css(infoDiv, NearCar.INFO_HEAD_STYLE);
      infoDiv.appendChild(infoSpan(txt));
      this._listHolder.appendChild(infoDiv);
    };
    let infoItem = (txtL, txtR) => {
      let infoDiv = document.createElement('div');
      this.css(infoDiv, NearCar.INFO_STYLE);
      infoDiv.appendChild(infoSpan(txtL));
      infoDiv.appendChild(infoSpan(txtR, 'float: right'));
      this._listHolder.appendChild(infoDiv);
    };

    this._listHolder.innerHTML = '';
    if (!this._areaServiceAble) {
      infoHead('Area Not Serviceable');
      return;
    }
    if (!this._foundCars || this._foundCars.length == 0) {
      infoHead('No Cabs Found');
      return;
    }
    infoItem('Found Cabs: ', this._foundCars.length);
    let minCar = this._foundCars.reduce( (a, b) => a._dist < b._dist ? a : b );
    infoItem('Nearest Cab (BC' + minCar._id + '):', 
      (minCar._dist * RegionizedMap.SCALE / 1000).toFixed(1) + 'km');

    this.highlightNearest(minCar);
  }

  highlightNearest(car) {
    let cx = this._canvas.getContext('2d');
    let xOffset = car._x - this._pos.x, yOffset = car._y - this._pos.y;
    cx.beginPath();
    cx.arc(this.canvasWd()/2 + xOffset, this.canvasHt()/2 + yOffset, 4, 0, 2 * Math.PI);
    cx.strokeStyle = NearBar.BEER_COLOR;
    cx.stroke();
  }

  launch() {
    this._foundCarsCallback = () => {};
    return super.launch();
  }
  
  appRootStyle = () => Object.assign(super.appRootStyle(), { gridTemplateRows: '6fr 3fr 1fr' });
  canvasWd = () => NearCar.CANVAS_WD;
  canvasHt = () => NearCar.CANVAS_HT;
  settingDbSelections = () => [ NearApp.HILBERT_DB, NearApp.GEOHASH_DB ];

  findHelpText = () => `Party Over! Now wanna ride home. Click on FIND ME A CAB. As simple as it can be. 
    NearCar will start searching for rides near you. Note that on the left map, Orange cabs are already 
    hired. NearCar will make sure to only search for available ones!!`;
  listHelpText = () => `NearCar will show you the nearest cab (along with its Plate Number and Distance) 
    from you. The nearest car will be highlighted on the mini-map. It will also let you know if there aren't 
    any Cabs available or if the location is not serviceable`;
  settingsHelpText = () => `App Settings ... select which backend you want the queries to be fired. Each 
    have their own merits and demerits. To know a little bit more about them, scroll down. Fair waring, 
    might bore you!`;

}

NearCar.CANVAS_WD = 225;
NearCar.CANVAS_HT = 192;
NearCar.QUERY_RANGE = 120;

NearCar.INFO_HEAD_STYLE = { 
  fontSize: '1.2em',
  textAlign: 'center',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontVariant: 'small-caps',
  fontStyle: 'italic',
  color: 'rgb(14, 43, 10)'
};

NearCar.INFO_STYLE = { 
  fontSize: '1em',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontVariant: 'small-caps',
  fontStyle: 'italic',
  color: 'rgb(14, 43, 10)'
};