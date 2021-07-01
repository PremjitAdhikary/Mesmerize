import { pages } from '../common/pages.js';

(function() {

  class PhoneElement extends HTMLElement {

    constructor() {
      super();
      this._id = '1000';
      this._shadow = this.attachShadow({ mode: 'open' });
      this.setupHome();

      this._phoneServices = new PhoneServices(this);
      this._services = this._phoneServices.registeredServices(this._id);

      this._services.registerEvent('Notify', e => {
        if (this._phoneServices._activeClientId === '') {
          this._services.showMessage('From System: ' + e.mess);
        }
      });
    }

    get services() {
      return this._services;
    }
    
    registerApp(app) {
      return this._phoneServices.registerApp(app);
    }

    connectedCallback() {
      this._shadow.innerHTML = `
      <link rel="stylesheet" href="${pages.getBase()}/components/phone.css">

      <style>

      .ls-block-group {
        display: inline-block;
        margin: auto;
      }

      ` + 
      this.setupLoadingScreenLightsPulseStyle() + 
      `

      #ls-block1, #ls-block2, #ls-block3, #ls-block4, #ls-block5, #ls-block6, #ls-block7, #ls-block8 {
        width:20px;
        height:8px;
        background:yellowgreen;
        margin-right:5px;
        float:left;
      }
      ` + 
      this.setupLoadingScreenLightsPulseAnimationStyle() + 
      `

      </style>

      <div class="phone">

        <div id="phone-front">
          <div id="upper-strip" class="upper-strip"><br>M-Phone</div>
          <div id="view-area" class="view-area"></div>
          <div id="home-btn"><img src="${pages.getBase()}/components/img/phone-icons/home.png"></div>
        </div>

        <div id="message-screen" class="message-layer">
          <div id="the-message" class="message center"></div>
          <div id="close-message" class="cross">&otimes;</div>
        </div>

        <div id="loading-screen" class="top-layer">
          <div class="ls-block-group">`
          +
          this.setupLoadingScreenLights();
          +
          `</div>
        </div>
      </div>
      `;

      this._shadow.getElementById('close-message').onclick = e => 
        this._phoneServices.hideMessage(this._phoneServices._memory.get(this._id).get('smClientId'));

      this.setupHomeBtn();

      this._services.hideMessage();

      this._services.hideLoadingScreen();
    }

    setupHome() {
      this._homeDiv = document.createElement('div');
      this._homeDiv.classList.add('home-page');
    }

    setupLoadingScreenLightsPulseStyle() {
      let keyframes = [0, 7, 13, 20, 27, 33, 40, 47, 53, 60, 67, 73, 80, 87, 93, 100];
      let shineframes = [
        [7], [13, 93], [20, 87], [27, 80], [33, 73], [40, 67], [47, 60], [53]
      ];
      let s = ``;
      for (let i=1; i<=8; i++) {
        s += (`@keyframes pulse` + i + ` {`);
        for (let kf of keyframes) {
          s +=  (kf+`% {opacity: ` + (shineframes[i-1].includes(kf) ? '1' : '0.5') + `;}`);
        }
        s += `}`;
      }
      return s;
    }

    setupLoadingScreenLightsPulseAnimationStyle() {
      let s = ``;
      for (let i=1; i<=8; i++) {
        s += `#ls-block` + i + `{
          animation: pulse` + i + ` 2s linear;
          animation-iteration-count: infinite;
        }`;
      }
      return s;
    }

    setupLoadingScreenLights() {
      let s = ``;
      for (let i=1; i<=8; i++) {
        s += `<div id="ls-block` + i + `"></div>`;
      }
      return s;
    }

    setupHomeBtn() {
      let homeBtn = this._shadow.getElementById('home-btn');
      let clickEvent = e => {
        let vu = this._shadow.getElementById('view-area');
        vu.innerHTML = '';
        vu.appendChild(this._homeDiv);
        if (this._phoneServices._activeClientId !== '') {
          this._phoneServices._apps.get(this._phoneServices._activeClientId).sleep();
          this._phoneServices._activeClientId = '';
        }
      };
      homeBtn.addEventListener('click', clickEvent);
      homeBtn.click();
    }

  }

  class PhoneServices {

    constructor(phone) {
      this._phone = phone;
      this._shadow = phone._shadow;
      this._rootId = phone._id;
      this._activeClientId = '';

      this._apps = new Map();
      this._memory = new Map();
      this._memory.set(this._rootId, new Map());

      this._eventCallbacks = new Map();

      this._idSeq = 100;
    }

    hideMessage(clientId) {
      if (!this.activeClient(clientId)) return;
      this._shadow.getElementById('message-screen').style.display = 'none';
      if (!this._memory.get(clientId).get('smCallback')) return;
      this._memory.get(clientId).get('smCallback')();
    }

    showMessage(clientId, message, callback = () => {}) {
      if (!this.activeClient(clientId)) return;
      this._shadow.getElementById('the-message').innerHTML = '<p>' + message + '</p>';
      this._shadow.getElementById('message-screen').style.display = 'flex';
      this._memory.get(this._rootId).set('smClientId', clientId);
      this._memory.get(clientId).set('smCallback', callback);
    }

    showLoadingScreen(clientId) {
      if (!this.activeClient(clientId)) return;
      this._shadow.getElementById('loading-screen').style.display = 'flex';
    }

    hideLoadingScreen(clientId) {
      if (!this.activeClient(clientId)) return;
      this._shadow.getElementById('loading-screen').style.display = 'none';
    }

    memoryStore(clientId, key, value) {
      if (!this.validateClient(clientId)) return;
      this._memory.get(clientId).set(key, value);
    }

    memoryRetrieve(clientId, key) {
      if (!this.validateClient(clientId)) return;
      return this._memory.get(clientId).get(key);
    }

    hideApp(clientId) {
      if (!this.activeClient(clientId)) return;
      this._shadow.getElementById('home-btn').click();
    }

    registerEvent(clientId, eventName, eventCallback) {
      if (!this.validateClient(clientId)) return;
      if (!this._eventCallbacks.has(eventName)) 
        this._eventCallbacks.set(eventName, []);
      this._eventCallbacks.get(eventName).push(eventCallback);
    }

    dispatchEvent(clientId, eventName, event) {
      if (!this.validateClient(clientId)) return;
      if (!this._eventCallbacks.has(eventName)) {
        console.error('None registered for ' + eventName);
        return;
      }
      for (let callback of this._eventCallbacks.get(eventName)) 
        callback(event);
    }

    activeClient(clientId) {
      return clientId === this._rootId || clientId === this._activeClientId;
    }

    validateClient(clientId) {
      return clientId === this._rootId || this._apps.has(clientId);
    }

    registerApp(app) {
      let appId = this._idSeq;
      app.build();
      this._memory.set(appId, new Map());
      this._idSeq++;
      app._id = appId;
      this._apps.set(appId, app);
      app._services = this.registeredServices(appId);

      let iconHolderDiv = document.createElement('div');
      iconHolderDiv.classList.add('home-page-icon');
      
      let iconImg = document.createElement("img");
      iconImg.src = pages.getBase() + app._iconUrl;
      iconImg.classList.add('home-page-icon-items');
      iconHolderDiv.appendChild(iconImg);
      
      let iconNameDiv = document.createElement('div');
      iconNameDiv.append(document.createTextNode(app._name));
      iconNameDiv.classList.add('home-page-icon-items');
      iconHolderDiv.appendChild(iconNameDiv);
      this._phone._homeDiv.appendChild(iconHolderDiv);

      let me = this;
      let clickEvent = e => {
        me._activeClientId = appId;
        let vu = me._shadow.getElementById('view-area');
        vu.innerHTML = '';
        vu.appendChild(app.launch());
      };
      iconHolderDiv.addEventListener('click', clickEvent);

      app.postBuild();
    }

    registeredServices(clientId) {
      let me = this;
      return {
        hideMessage: () => me.hideMessage(clientId), 
        showMessage: (msg, callback) => me.showMessage(clientId, msg, callback), 
        showLoadingScreen: () => me.showLoadingScreen(clientId), 
        hideLoadingScreen: () => me.hideLoadingScreen(clientId), 
        memoryStore: (key, value) => me.memoryStore(clientId, key, value), 
        memoryRetrieve: (key) => me.memoryRetrieve(clientId, key), 
        hideApp: () => me.hideApp(clientId), 
        registerEvent: (eventName, eventCallback) => me.registerEvent(clientId, eventName, eventCallback), 
        dispatchEvent: (eventName, event) => me.dispatchEvent(clientId, eventName, event)
      };
    }

  }

  customElements.define('m-phone', PhoneElement);
})();