class NearBar extends NearApp {

  constructor() {
    super('NearBar', '/location-based-services/img/app-icons/nearBar.png');
    this._minJointsToList = 10;
  }

  build() {
    super.build();
  }

  buildFind() {
    super.buildFind();
    
    this._findHolder.appendChild(document.createElement('br'));
    let headDiv = document.createElement('div');
    headDiv.append(document.createTextNode('\u00A0\u00A0Find Me A Party\u00A0\u00A0'));
    this._findHolder.appendChild(headDiv);
    this._findHolder.appendChild(document.createElement('br'));

    let btnHolder = document.createElement('div');

    let btnBuilder = (btnTxt, btnFilter) => {
      let btn = document.createElement('span');
      btn.append(document.createTextNode('\u00A0\u00A0' + btnTxt + '\u00A0\u00A0'));
      btn.classList.add('phn-btn');
      btn.addEventListener('click', e => this.findJoints(btnFilter));
      btnHolder.appendChild(btn);
    };

    btnBuilder('BEER', Joints.BREWERY);
    btnHolder.append(document.createTextNode('\u00A0\u00A0'));
    btnBuilder('PUB', Joints.PUB);
    btnHolder.append(document.createTextNode('\u00A0\u00A0'));
    btnBuilder('ANY', '');
   
    this._findHolder.appendChild(btnHolder); 
  }

  findJoints(filter) {
    this._filter = filter;
    this._range += 20;
    this._services.dispatchEvent('FindJoints', { range: this._range } );
    this._tools.get('L').dom.click();
  }

  postBuild() {
    super.postBuild();
    
    this._services.registerEvent('FoundJoints', e => {
      let temp = (this._filter === '' ? e.foundJoints : e.foundJoints.filter(j => j._type == this._filter) );
      this._foundJoints = [];
      temp.forEach( t => this._foundJoints.push({...t}) );
      this.updateUI();
      this.updateJoints();
      if (this._foundJoints.length > this._minJointsToList || this._range > height * 2) {
        this._range = 0;
      } else {
        this._range += 20;
        this._services.dispatchEvent('FindJoints', { range: this._range } );
      }
    });
  }

  updateUI() {
    super.updateUI();
    this.markJoints();
  }

  updateJoints() {
    this.updateFoundJoints();
    this.updateList();
  }

  markJoints() {
    if (!this._foundJoints) {
      return;
    }

    let cx = this._canvas.getContext('2d');
    for (let joint of this._foundJoints) {
      let xOffset = joint._x - this._pos.x, yOffset = joint._y - this._pos.y;
      cx.beginPath();
      cx.arc(this.canvasWd()/2 + xOffset, this.canvasHt()/2 + yOffset, 2, 0, 2 * Math.PI);
      cx.fillStyle = joint._type == Joints.BREWERY ? NearBar.BEER_COLOR : NearBar.PUB_COLOR;
      cx.fill();
    }
  }

  updateFoundJoints() {
    if (!this._foundJoints) {
      return;
    }
    this._foundJoints.forEach( j => j._dist = dist(this._pos.x, this._pos.y, j._x, j._y) );
    this._foundJoints.sort((a, b) => a._dist - b._dist);
  }

  updateList() {
    this._listHolder.innerHTML = '';
    if (!this._foundJoints) {
      return;
    }
    for (let i = 0; i < this._foundJoints.length && i < this._minJointsToList; i++) {
      let joint = this._foundJoints[i];
      let itemDiv = document.createElement('div');
      let iName = document.createElement('span');
      iName.append(document.createTextNode('\u00A0' + joint._name));
      itemDiv.appendChild(iName);
      let iDist = document.createElement('span');
      iDist.append(document.createTextNode(this.roundOffDistance(joint._dist) + '\u00A0'));
      iDist.style = 'float: right';
      itemDiv.appendChild(iDist);
      this.css(itemDiv, NearBar.ITEM_STYLE);
      itemDiv.style.backgroundColor = joint._type == Joints.BREWERY ? NearBar.BEER_COLOR : NearBar.PUB_COLOR;
      itemDiv.addEventListener('click', this.hilightItemClicked(i));
      this._listHolder.appendChild(itemDiv);
    }
  }

  hilightItemClicked(i) {
    let joint = this._foundJoints[i];
    return e => {
      this.updateUI();
      let cx = this._canvas.getContext('2d');
      let xOffset = joint._x - this._pos.x, yOffset = joint._y - this._pos.y;
      cx.beginPath();
      cx.arc(this.canvasWd()/2 + xOffset, this.canvasHt()/2 + yOffset, 4, 0, 2 * Math.PI);
      cx.strokeStyle = joint._type == Joints.BREWERY ? NearBar.BEER_COLOR : NearBar.PUB_COLOR;
      cx.stroke();
    };
  }

  roundOffDistance(dist) {
    let d = dist * RegionizedMap.SCALE;
    return (d > 1000 ? (d/1000).toFixed(1) + 'km' : d.toFixed(0) + 'm');
  }

  appRootStyle = () => Object.assign(super.appRootStyle(), { gridTemplateRows: '5fr 4fr 1fr' });
  canvasWd = () => NearBar.CANVAS_WD;
  canvasHt = () => NearBar.CANVAS_HT;
  settingDbSelections = () => [ NearApp.QUADTREE_DB, NearApp.HILBERT_DB, NearApp.GEOHASH_DB ];

  findHelpText = () => `Party Time!! Are you a Beer Buff out to cheer your favourite football team? 
    You maybe the sit back, relax, enjoy music and good food in a Pub kinda guy. Or you 
    just dont care as long as you get some quality drinks... let NearBar find you the nearest 
    parties in the town!!`;
  listHelpText = () => `Once you have made you selection NearBar will start searching the area near you for 
    awesome parties. The App keeps increasing it's search range till at least ` + this._minJointsToList 
    + ` joints around you where you can enjoy are listed! It will also show you the distance from your 
    current location so that you can plan accordingly. Click on the item to highlight the joint location on 
    the mini-map. Orange ones are Breweries and purple ones are Pubs.`;
  settingsHelpText = () => `App Settings ... select which backend you want the queries to be fired. Each have their 
    own merits and demerits. To know a little bit more about them, scroll down. Fair waring, might 
    bore you!`;

}

NearBar.CANVAS_WD = 225;
NearBar.CANVAS_HT = 160;
NearBar.BEER_COLOR = '#ff6600';
NearBar.PUB_COLOR = '#4b0082';

NearBar.ITEM_STYLE = {
  width: '95%',
  border: '2px white solid',
  fontSize: '0.9em',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontVariant: 'small-caps',
  fontStyle: 'italic',
  color: 'greenyellow'
};