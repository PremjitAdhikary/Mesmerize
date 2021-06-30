class NearApp extends PhoneApp {

  constructor(name, imgLoc) {
    super(name, imgLoc);
    this._range = 0;
    this._tools = new Map();
    this._selectedTool;
    this._settingButtons = [];
    this._dbChoice;
  }

  build() {
    super.build();
    this.css(this._appRoot, this.appRootStyle());
    this.buildView();
    this.buildFind();
    this.buildList();
    this.buildSetting();
    this.buildTool();
  }

  buildView() {
    this._mapHolder = document.createElement('div');
    this.css(this._mapHolder, this.viewStyle());
    this._appRoot.appendChild(this._mapHolder);

    this._canvas = document.createElement('canvas');
    this._canvas.width = this.canvasWd();
    this._canvas.height = this.canvasHt();
    this.css(this._canvas, { width: this.canvasWd() + 'px', height: this.canvasHt() + 'px' });
    this._mapHolder.appendChild(this._canvas);
  }

  buildFind() {
    this._findHolder = document.createElement('div');
    this.css(this._findHolder, this.findStyle());
    this._appRoot.appendChild(this._findHolder);
  }

  buildList() {
    this._listHolder = document.createElement('div');
    this.css(this._listHolder, NearBar.LIST_STYLE);
    this._appRoot.appendChild(this._listHolder);
  }

  buildSetting() {
    this._settingHolder = document.createElement('div');
    this.css(this._settingHolder, this.settingStyle());
    this._appRoot.appendChild(this._settingHolder);

    let btnHolder = document.createElement('div');
    this.css(btnHolder, {padding: '10px'} );

    let btnBuilder = (btnTxt, db) => {
      let btn = document.createElement('div');
      btn.append(document.createTextNode('\u00A0' + btnTxt + '\u00A0'));
      this.css(btn, this.settingDbSelectStyle());
      btn.addEventListener('click', this.selectDb(db));
      this._settingButtons.push(btn);
      btnHolder.appendChild(btn);
    };

    this.settingDbSelections().forEach( dbs => btnBuilder(dbs.name, dbs.db) );
    this._settingHolder.appendChild(btnHolder);
  }

  selectDb(db) {
    return e => {
      this._dbChoice = db;
      this._services.dispatchEvent('AppLaunched', { app:  this._name, db: this._dbChoice } );
      this._settingButtons.forEach( b => this.css(b, {
        backgroundColor: 'rgb(14, 43, 10)',
        color: 'yellowgreen'
      }) );
      let elem = e.target || e.srcElement;
      this.css(elem, {
        backgroundColor: 'yellowgreen',
        color: 'rgb(14, 43, 10)'
      });
    };
  }

  buildTool() {
    let toolHolder = document.createElement('div');
    this.css(toolHolder, NearApp.TOOL_HOLDER_STYLE);
    this._appRoot.appendChild(toolHolder);

    for (let i = 0; i < NearApp.TOOLS.length; i++) {
      let op = document.createElement('div');
      this.css(op, NearApp.TOOL_STYLE);
      op.style.backgroundImage = 'url(' + NearApp.TOOL_ICONS.get(NearApp.TOOLS[i]) + ')';
      toolHolder.appendChild(op);
      this._tools.set(NearApp.TOOLS[i], { dom: op });
    }

    this._tools.get('F').dom.addEventListener('click', e => this.highlightTool('F', this._findHolder) );
    this._tools.get('L').dom.addEventListener('click', e => this.highlightTool('L', this._listHolder) );
    this._tools.get('S').dom.addEventListener('click', e => this.highlightTool('S', this._settingHolder) );
    this._tools.get('H').dom.addEventListener('click', e => this.showHelp() );

    this._tools.get('F').dom.click();
  }

  highlightTool(tool, holder) {
    this._selectedTool = tool;
    Array.from(this._tools.keys())
      .forEach( t => this._tools.get(t).dom.style.border = '0px grey solid' );
    this._tools.get(tool).dom.style.border = '2px yellowgreen solid';

    this._findHolder.style.display = 'none';
    this._listHolder.style.display = 'none';
    this._settingHolder.style.display = 'none';
    holder.style.display = 'block';
  }

  showHelp() {
    let getText = t => {
      switch(t) {
        case 'F': return this.findHelpText();
        case 'L': return this.listHelpText();
        case 'S': return this.settingsHelpText();
      }
    };
    this._services.showMessage(getText(this._selectedTool));
  }
  
  postBuild() {
    this._services.registerEvent('UpdateLocation', e => this.updateLocation(e));
    this._settingButtons[0].click();
  }

  updateLocation(e) {
    this._pos = e.position;
    this.css(this._mapHolder, {
      backgroundImage: "url(" + e.bg + ")",
      backgroundPositionX: (-e.position.x + this.canvasWd()/2) + 'px',
      backgroundPositionY: (-e.position.y + this.canvasHt()/2) + 'px'
    });
    this.updateUI();
  }

  updateUI() {
    this.markUser();
  }

  markUser() {
    let cx = this._canvas.getContext('2d');
    cx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    cx.beginPath();
    cx.arc(this._canvas.width/2, this._canvas.height/2, 5, 0, 2 * Math.PI);
    cx.strokeStyle = '#000000';
    cx.stroke();
    cx.beginPath();
    cx.arc(this._canvas.width/2, this._canvas.height/2, 3, 0, 2 * Math.PI);
    cx.fillStyle = '#000000';
    cx.fill();
  }

  launch() {
    this._services.dispatchEvent('AppLaunched', { app: this._name, db: this._dbChoice } );
    return super.launch();
  }

  sleep() {
    this._services.dispatchEvent('AppClosed', {} );
  }

  appRootStyle() { return NearApp.APP_ROOT_STYLE; }
  viewStyle() { return NearApp.VIEW_STYLE; }
  canvasWd = () => 100;
  canvasHt = () => 100;
  findStyle() { return NearApp.FIND_STYLE; }
  listStyle() { return NearApp.LIST_STYLE; }
  settingStyle() { return NearApp.SETTING_STYLE; }
  settingDbSelectStyle() { return NearApp.SETTING_DB_SELECT_STYLE; }
  settingDbSelections = () => []; 
  findHelpText = () => 'Find help!';
  listHelpText = () => 'List help!'; 
  settingsHelpText = () => 'Set help!';
}

NearApp.QUADTREE_DB = { name: 'QuadTree Database', db: 'qt' };
NearApp.HILBERT_DB = { name: 'Hilbert Curve Database', db: 'hc' };
NearApp.GEOHASH_DB = { name: 'GeoHash Database', db: 'gh' };

NearApp.TOOLS = ['F', 'L', 'S', 'H'];
NearApp.TOOL_ICONS = new Map([
  ['F', './img/app-icons/findTool.png'], ['S', './img/app-icons/settingsTool.png'], 
  ['L', './img/app-icons/listTool.png'], ['H', './img/app-icons/helpTool.png']
]);

NearApp.APP_ROOT_STYLE = {
  width: '100%',
  height: '100%',
  backgroundColor: 'rgb(14, 43, 10)',
  display: 'grid',
  gridTemplateAreas: '"view" "op" "tool"'
};

NearApp.VIEW_STYLE = {
  width: '100%', 
  backgroundRepeat: 'no-repeat',
  gridArea: 'view'
};

NearApp.FIND_STYLE = {
  width: '100%',
  backgroundColor: 'rgb(14, 43, 10)',
  fontSize: '1em',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontVariant: 'small-caps',
  fontStyle: 'italic',
  color: 'rgb(232, 247, 230)',
  textAlign: 'center',
  gridArea: 'op'
};

NearApp.SETTING_STYLE = {
  width: '100%',
  backgroundColor: 'rgb(14, 43, 10)',
  gridArea: 'op'
};

NearApp.LIST_STYLE = {
  width: '100%',
  backgroundColor: 'rgb(232, 247, 230)',
  gridArea: 'op',
  overflowY: 'auto'
};

NearApp.SETTING_DB_SELECT_STYLE = {
  padding: '5px',
  fontSize: '0.9em',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontVariant: 'small-caps',
  fontStyle: 'italic',
  border: '1px yellowgreen solid',
  borderRadius: '5px',
};

NearApp.TOOL_HOLDER_STYLE = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr'
};

NearApp.TOOL_STYLE = {
  width: '92%',
  borderRadius: '7px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain'
};