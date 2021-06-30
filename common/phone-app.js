class PhoneApp {

  constructor(name, iconUrl) {
    this._name = name;
    this._iconUrl = iconUrl;
  }

  build() {
    this._appRoot = document.createElement('div');
    this._appRoot.style.width = '100%';
    this._appRoot.style.height = '100%';
    this._appRoot.style.backgroundColor = 'grey';
    this._appRoot.style.overflowY = 'auto';
    this._appRoot.style.overflowX = 'auto';
  }

  postBuild() {}

  launch() {
    return this._appRoot;
  }

  sleep() {}
  
  css(element, style) {
    for (const property in style)
        element.style[property] = style[property];
  }

}