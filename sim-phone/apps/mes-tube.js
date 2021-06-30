class MesTube extends PhoneApp {

  constructor() {
    super('MesTube', '/sim-phone/img/app-icons/mesTube.png');

    this._list = [ 
      new TubeItem('Spiralling Primes', './img/mes-tube/ps.gif', './img/mes-tube/PrimeSpirals.jpg', 
        'From Prime Spirals segment. Pprime numbers are plotted to make spirals.'), 
      new TubeItem('Fractal Shapes', './img/mes-tube/fractal.gif', './img/mes-tube/FractalShapes.jpg', 
        'Few Interesting Fractals from L-Systems Revisted segment.'), 
      new TubeItem('Kombat Fighters', './img/mes-tube/fighters.gif', 
        './img/mes-tube/KombatFighters.jpg', `From Simulated Combat segment. My favourite segment 
        (as of now). Worked too hard for this.`), 
      new TubeItem('Mathematical Rose', './img/mes-tube/rose.gif', './img/mes-tube/MathematicalRose.jpg', 
        'Maths used to render roses from Rose segment.'), 
      new TubeItem('Fractal Trees', './img/mes-tube/tree.gif', './img/mes-tube/FractalTree.jpg', 
        'Cool ones from Fractal Trees and L-Systems Revisited segments.')
    ];
    this._selectedItem = this._list[0];
  }

  build() {
    super.build();
    this._appRoot.style.backgroundColor = 'rgb(230, 230, 230)';
    this.buildHeader();
    this._listDiv = this.buildList();
    this._viewerDiv = this.buildViewer();

    this.updateViewer();
    this._viewerDiv.style.display = 'none';
  }

  postBuild() {
    this._services.registerEvent('Notify', e => {
      this._services.showMessage('From MesTube: ' + e.mess);
    });
  }

  buildHeader() {
    let header = document.createElement('div');
    header.append(document.createTextNode('MesTube'));
    this.css(header, MesTube.HEADER_STYLE);
    this._appRoot.appendChild(header);
  }

  buildList() {
    let list = document.createElement('div');
    this.css(list, MesTube.LIST_STYLE);
    for (let item of this._list) {
      let itemDiv = document.createElement('div');
      let preview = document.createElement('img');
      preview.src = item._thumbLoc;
      itemDiv.appendChild(preview);
      itemDiv.append(document.createTextNode('\u00A0\u00A0'+item._name));
      this.css(itemDiv, MesTube.LIST_ITEM_STYLE);
      itemDiv.addEventListener('click', this.itemClickEvent(item));
      list.appendChild(itemDiv);
    }
    this._appRoot.appendChild(list);

    return list;
  }

  buildViewer() {
    let viewer = document.createElement('div');
    this.css(viewer, MesTube.VIEWER_STYLE);

    let title = document.createElement('div');
    title.style.textAlign = 'center';
    title.id = 'viewer-title';
    this.css(title, MesTube.VIEWER_TITLE_STYLE);
    viewer.appendChild(title);

    let gifHolder = document.createElement('div');
    gifHolder.style.height = '80%';
    let gif = document.createElement('img');
    gif.id = 'viewer-gif';
    this.css(gif, MesTube.VIEWER_GIF_STYLE);
    gifHolder.appendChild(gif);
    viewer.appendChild(gifHolder);

    let btnHolder = document.createElement('div');
    this.css(btnHolder, { height: '10%', textAlign: 'center' });

    let backBtn = document.createElement('span');
    backBtn.append(document.createTextNode('\u2190'));
    backBtn.classList.add('phn-btn');
    btnHolder.appendChild(backBtn);

    btnHolder.append(document.createTextNode('\u00A0\u00A0'));
    
    let infoBtn = document.createElement('span');
    infoBtn.append(document.createTextNode('\u00A0?\u00A0'));
    infoBtn.classList.add('phn-btn');
    btnHolder.appendChild(infoBtn);
    viewer.appendChild(btnHolder);

    backBtn.addEventListener('click', this.backClickEvent());
    infoBtn.addEventListener('click', this.infoClickEvent());

    this._appRoot.appendChild(viewer);
    return viewer;
  }

  updateViewer() {
    let title = this._viewerDiv.querySelector('#viewer-title');
    title.innerHTML = '';
    title.append(document.createTextNode(this._selectedItem._name));
    
    let gif = this._viewerDiv.querySelector('#viewer-gif');
    gif.src = this._selectedItem._gifLoc;
  }

  itemClickEvent(item) {
    return e => {
      this._selectedItem = item;
      this.updateViewer();
      this._listDiv.style.display = 'none';
      this._viewerDiv.style.display = 'block';
    };
  }

  infoClickEvent() {
    return e => this._services.showMessage(this._selectedItem._desc);
  }

  backClickEvent() {
    return e => {
      this._listDiv.style.display = 'block';
      this._viewerDiv.style.display = 'none';
    };
  }

}

class TubeItem {
  constructor(name, gifLoc, thumbLoc, desc) {
    this._name = name;
    this._gifLoc = gifLoc;
    this._thumbLoc = thumbLoc;
    this._desc = desc;
  }
}

MesTube.HEADER_STYLE = {
  color: 'yellowgreen',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontSize: '1.5em',
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontVariant: 'small-caps',
  backgroundColor: 'rgb(14, 43, 10)',
  height: '15%'
};

MesTube.LIST_STYLE = {
  height: '85%',
  overflowY: 'auto',
  backgroundColor: 'rgb(232, 247, 230)'
};

MesTube.LIST_ITEM_STYLE = {
  height: '22%',
  fontSize: '0.8em',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontVariant: 'small-caps',
  fontStyle: 'italic',
  color: 'rgb(14, 43, 10)',
  border: '2px white solid'
};

MesTube.VIEWER_STYLE = {
  width: '100%',
  height: '85%',
  overflowX: 'hidden',
  overflowY: 'auto',
  backgroundColor: 'rgb(14, 43, 10)',
  color: 'yellowgreen'
};

MesTube.VIEWER_TITLE_STYLE = {
  height: '10%',
  fontSize: '0.9em',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontVariant: 'small-caps'
};

MesTube.VIEWER_GIF_STYLE = {
  width: '95%',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  objectFit: 'scale-down'
};