class MesNotes extends PhoneApp {

  constructor() {
    super('MesNotes', '/sim-phone-v2/img/app-icons/mesNotes.png');
  }

  build() {
    super.build();
    this._appRoot.style.backgroundColor = 'rgb(232, 247, 230)';
    this._noteArea = this.buildNoteArea();
    this.buildNewNoteButton();
    this.resetData();
  }

  requiredVersion() {
    return 2;
  }

  resetData() {
    this.paras = [];
    this._noteArea.innerHTML = '';
  }

  buildNoteArea() {
    let txtHolder = document.createElement('div');
    this._appRoot.appendChild(txtHolder);
    this.css(txtHolder, MesNotes.NOTE_AREA_STYLE);
    txtHolder.addEventListener('click', e => {
      this._services.showKeyboardScreen('', () => {
        this.paras.push(...this.processClipboardTxt());
        this.rebuildNoteArea();
      });
    });
    return txtHolder;
  }

  buildNewNoteButton() {
    let newNoteBtn = document.createElement('div');
    newNoteBtn.innerHTML = 'New';
    this._appRoot.appendChild(newNoteBtn);
    this.css(newNoteBtn, MesNotes.NEW_NOTE_BTN_STYLE);
    newNoteBtn.addEventListener('click', e => this.resetData());
  }

  processClipboardTxt() {
    let clipboardTxt = this._services.getClipboard();
    return clipboardTxt.length == 0 ? [] : clipboardTxt.split('\n');
  }

  rebuildNoteArea() {
    this._noteArea.innerHTML = '';
    this.addParas();
  }

  postBuild() {
    this.addParas();
  }

  addParas() {
    for (let p=0; p<this.paras.length; p++) {
      let para = document.createElement('p');
      let paraTxt = this.paras[p];
      para.innerHTML = this._services.plainTextToHtml(paraTxt);
      this._noteArea.appendChild(para);
      para.addEventListener('click', e => {
        this._services.showKeyboardScreen(paraTxt, () => {
          this.paras.splice(p, 1, ...this._services.getClipboard().split('\n'));
          this.rebuildNoteArea();
        });
        e.stopPropagation();
      });
    }
  }

}

MesNotes.NOTE_AREA_STYLE = {
  color: 'yellowgreen',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontSize: '0.9em',
  fontStyle: 'italic',
  height: '95%'
};

MesNotes.NEW_NOTE_BTN_STYLE = {
  color: 'rgb(232, 247, 230)', 
  backgroundColor: 'yellowgreen', 
  position: 'absolute', 
  border: '1px solid yellowgreen', 
  borderRadius: '2px', 
  fontSize: '1.1em',
  left: '82%', 
  top: '80%', 
  padding: '2px'
}