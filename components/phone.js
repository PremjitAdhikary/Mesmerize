import { pages } from '../common/pages.js';

(function() {

  /**
   * Usage:  
   * 
   * ```
   * // CSS to be defined to hold the Phone
   * .phone-holder {  
   *    width: 640px;  
   *    height: 480px;  
   * }  
   * .phone {  
   *    display:flex;  
   *    justify-content:center;  
   *    align-items:center;    
   * }  
   * 
   * //Html to declare the phone element  
   * <div class="phone-holder">  
   *   <m-phone id="m-phone-id" class="phone"></m-phone>  
   * </div>  
   * 
   * // Initializing and registering an App (MApp)  
   * mApp = new MApp();
   * document.getElementById('m-phone-id').registerApp(mApp);
   * 
   * // Interacting with phone services
   * document.getElementById('m-phone-id').services.registerEvent(
   *    eventName, onEventFunction );
   * document.getElementById('m-phone-id').services.dispatchEvent(
   *    eventName, eventObject );
   * ```
   */
  class PhoneElement extends HTMLElement {

    constructor() {
      super();
      this._id = '1000';
      this._version = 1;
      this._shadow = this.attachShadow({ mode: 'open' });
      this.setupHome();

      this._phoneServices = this.launchPhoneServices();
      this.activateServices();
    }

    launchPhoneServices() {
      let service = new PhoneServices();
      service.registerPhone(this);
      return service;
    }

    activateServices() {
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
      if (app.requiredVersion() > this._version) {
        console.error(app._name + ' needs Phone version ' + app._requiredVersion + '. It cannot be installed on earlier Phone version.');
        return;
      }
      return this._phoneServices.registerApp(app);
    }

    connectedCallback() {
      this._shadow.innerHTML = 
        this.linkedStylesheets() + 
        `<style>` + 
        this.addStyles() + 
        `</style>

        <div class="phone">`
        + this.addPhoneUIComponents() + 
        `</div>`
      ;

      this.addPhoneBehavior();
    }

    setupHome() {
      this._homeDiv = document.createElement('div');
      this._homeDiv.classList.add('home-page');
    }

    linkedStylesheets() {
      return `
      <link rel="stylesheet" href="${pages.getBase()}/components/phone.css">
      `;
    }

    addStyles() {
      return this.setupLoadingScreenLightsPulseStyle();
    }

    setupLoadingScreenLightsPulseStyle() {
      let keyframes = [0, 7, 13, 20, 27, 33, 40, 47, 53, 60, 67, 73, 80, 87, 93, 100];
      let shineframes = [
        [7], [13, 93], [20, 87], [27, 80], [33, 73], [40, 67], [47, 60], [53]
      ];
      let s = `

      .ls-block-group {
        display: inline-block;
        margin: auto;
      }

      `;
      for (let i=1; i<=8; i++) {
        s += (`@keyframes pulse` + i + ` {`);
        for (let kf of keyframes) {
          s +=  (kf+`% {opacity: ` + (shineframes[i-1].includes(kf) ? '1' : '0.5') + `;}`);
        }
        s += `}`;
      }
      s += `
      #ls-block1, #ls-block2, #ls-block3, #ls-block4, #ls-block5, #ls-block6, #ls-block7, #ls-block8 {
        width:20px;
        height:8px;
        background:yellowgreen;
        margin-right:5px;
        float:left;
      }
      `;
      for (let i=1; i<=8; i++) {
        s += `#ls-block` + i + `{
          animation: pulse` + i + ` 2s linear;
          animation-iteration-count: infinite;
        }`;
      }
      return s;
    }

    addPhoneUIComponents() {
      return this.setupPhoneUIDesign()
      + this.setupMessageScreen() 
      + this.setupLoadingScreenLights();
    }

    setupPhoneUIDesign() {
      return `
        <div id="phone-front">
          <div id="upper-strip" class="upper-strip"><br>M-Phone</div>
          <div id="view-area" class="view-area"></div>
          <div id="home-btn"><img src="${pages.getBase()}/components/img/phone-icons/home.png"></div>
        </div>
      `;
    }

    setupMessageScreen() {
      return `
        <div id="message-screen" class="message-layer">
          <div id="the-message" class="message center"></div>
          <div id="close-message" class="cross">&otimes;</div>
        </div>
      `;
    }

    setupLoadingScreenLights() {
      let s = ``;
      s += `
      <div id="loading-screen" class="top-layer">
        <div class="ls-block-group">`;
      for (let i=1; i<=8; i++) {
        s += `<div id="ls-block` + i + `"></div>`;
      }
      s += `
        </div>
      </div>`;
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

    addPhoneBehavior() {
      this._shadow.getElementById('close-message').onclick = e => 
        this._phoneServices.hideMessage(this._phoneServices._memory.get(this._id).get('smClientId'));

      this.setupHomeBtn();

      this._services.hideMessage();

      this._services.hideLoadingScreen();
    }

  }

  class PhoneServices {

    constructor() { }

    registerPhone(phone) {
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

  /**
   * //Html to declare the phone element  
   * <div class="phone-holder">  
   *   <m-phone-v2 id="m-phone-id" class="phone"></m-phone-v2>  
   * </div>
   */
  class PhoneV2Element extends PhoneElement {
    constructor() {
      super();
      this._version = 2;
    }

    launchPhoneServices() {
      let service = new PhoneV2Services();
      service.registerPhone(this);
      return service;
    }

    linkedStylesheets() {
      return super.linkedStylesheets() + `
      <link rel="stylesheet" href="${pages.getBase()}/components/phone-v2.css">
      `;
    }

    addPhoneUIComponents() {
      return super.addPhoneUIComponents()
      + this.setupKeyboardButtons();
    }

    setupKeyboardButtons() {
      let s = `
      <div id="keyboard-screen" class="keyboard-layer" tabindex="1">
        <div id="keyboard-txt-area" class="keyboard-txt"></div>
        <div id="keyboard-button" class="keyboard-btn">&#8682</div>
        <div class="keyboard-key-holder"><div class="keyboard-key-line">
      `;
      for (let i=1; i<=10; i++) {
        s += `<div id="key-block-` + (i%10) + `" class="keyboard-key">` + i%10 + `</div>`;
      }
      s += `
        </div>
        <div class="keyboard-key-line">
      `;
      let secondKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
      for (let i=0; i<secondKeys.length; i++) {
        s += `<div id="key-block-` + secondKeys[i] + `" class="keyboard-key">` + secondKeys[i] + `</div>`;
      }
      s += `
        </div>
        <div class="keyboard-key-line">
      `;
      let thirdKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
      for (let i=0; i<thirdKeys.length; i++) {
        s += `<div id="key-block-` + thirdKeys[i] + `" class="keyboard-key">` + thirdKeys[i] + `</div>`;
      }
      s += `
        </div>
        <div class="keyboard-key-line">
          <div id="key-block-caps" class="keyboard-key">&#8679</div>
      `;
      let forthKeys = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
      for (let i=0; i<forthKeys.length; i++) {
        s += `<div id="key-block-` + forthKeys[i] + `" class="keyboard-key">` + forthKeys[i] + `</div>`;
      }
      s += `
          <div id="key-block-bks" class="keyboard-key">&#8678</div>
        </div>
        <div class="keyboard-key-line last-line">
          <div id="key-block-qot" class="keyboard-key">&quot;</div>
          <div id="key-block-col" class="keyboard-key">&semi;</div>
          <div id="key-block-que" class="keyboard-key">?</div>
          <div id="key-block-spc" class="keyboard-spc-key">&nbsp;</div>
          <div id="key-block-com" class="keyboard-key">&comma;</div>
          <div id="key-block-per" class="keyboard-key">&period;</div>
          <div id="key-block-ntr" class="keyboard-key">&#8626</div>
        </div>
      </div>
      `;
      return s;
    }

    addPhoneBehavior() {
      super.addPhoneBehavior();
      this.addKeyboardButtonsBehavior();
      this.addKeyPressOnKeyboardBehavior();
    }

    addKeyboardButtonsBehavior() {
      let txtArea = this._shadow.getElementById('keyboard-txt-area');
      let retrieveKeyboardTxt = () => this._phoneServices._activeClientId === '' ? 
          this._services.memoryRetrieve(PhoneV2Services.KEYBOARD_CLIP) 
          : this._phoneServices.memoryRetrieve(this._phoneServices._activeClientId, PhoneV2Services.KEYBOARD_CLIP);
      let storeKeyboardTxt = updatedTxt => {
        if (this._phoneServices._activeClientId === '') this._services.memoryStore(PhoneV2Services.KEYBOARD_CLIP, updatedTxt);
        else this._phoneServices.memoryStore(this._phoneServices._activeClientId, PhoneV2Services.KEYBOARD_CLIP, updatedTxt);
      };
      let updateKeyboardTxt = (ch) => {
        let currentTxt = retrieveKeyboardTxt();
        let updatedTxt = (currentTxt == undefined ? '' : currentTxt) + ch;
        storeKeyboardTxt(updatedTxt);
        txtArea.innerHTML = this._services.plainTextToHtml(updatedTxt);
        txtArea.scrollTop = txtArea.scrollHeight;
      };
      let alphaNums = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
      ];
      for (let i=0; i<alphaNums.length; i++) {
        this._shadow.getElementById('key-block-' + alphaNums[i]).addEventListener('click', e => updateKeyboardTxt(e.target.innerHTML));
      }
      let spclKeys = [['key-block-qot', '\"'], ['key-block-col', ';'], ['key-block-que', '?'], ['key-block-spc', ' '], 
        ['key-block-com', ','], ['key-block-per', '.'], ['key-block-ntr', '\n']];
      spclKeys.forEach(sk => this._shadow.getElementById(sk[0]).addEventListener('click', e => updateKeyboardTxt(sk[1])));
      let capsOn = false;
      this._shadow.getElementById('key-block-caps').addEventListener('click', e => {
        capsOn = !capsOn;
        e.target.innerHTML = (capsOn ? '&#8681' : '&#8679');
        for (let i=0; i<alphaNums.length; i++) {
          this._shadow.getElementById('key-block-' + alphaNums[i]).innerHTML = (capsOn ? alphaNums[i].toUpperCase() : alphaNums[i]);
        }
      });
      this._shadow.getElementById('key-block-bks').addEventListener('click', e => {
        let currentTxt = retrieveKeyboardTxt();
        let updatedTxt = (currentTxt.length === 0) ? '' : currentTxt.slice(0, -1);
        storeKeyboardTxt(updatedTxt);
        txtArea.innerHTML = this._services.plainTextToHtml(updatedTxt);
        txtArea.scrollTop = txtArea.scrollHeight;
      });
      this._shadow.getElementById('keyboard-button').addEventListener('click', e => {
        let requestFromSystem = this._phoneServices._activeClientId === '';
        if (requestFromSystem) this._services.hideKeyboardScreen();
        else this._phoneServices.hideKeyboardScreen(this._phoneServices._activeClientId);
      });

      this._services.hideKeyboardScreen();
    }

    addKeyPressOnKeyboardBehavior() {
      let spclKeysMap = new Map([
        ['\"', 'key-block-qot'], [';', 'key-block-col'], ['?', 'key-block-que'], [' ', 'key-block-spc'], 
        [',', 'key-block-com'], ['.', 'key-block-per'], ['Backspace', 'key-block-bks'], 
        ['CapsLock', 'key-block-caps'], ['Enter', 'key-block-ntr']
      ]);
      this._shadow.getElementById('keyboard-screen').addEventListener("keyup", e => {
        if (spclKeysMap.has(e.key)) 
          this._shadow.getElementById(spclKeysMap.get(e.key)).click();
        else
          this._shadow.getElementById('key-block-' + e.key.toLowerCase()).click();
        e.stopPropagation();
      });
    }

  }

  class PhoneV2Services extends PhoneServices {
    constructor() {
      super();
    }
    
    showKeyboardScreen(clientId, txt = '', callback = () => {}) {
      if (!this.activeClient(clientId)) return;
      this._shadow.getElementById('keyboard-screen').style.display = 'grid';
      this.memoryStore(clientId, PhoneV2Services.KEYBOARD_CLIP, txt);
      this._shadow.getElementById('keyboard-txt-area').innerHTML = this.plainTextToHtml(txt);
      this._memory.get(clientId).set('skbsCallback', callback);
    }

    hideKeyboardScreen(clientId) {
      if (!this.activeClient(clientId)) return;
      this._shadow.getElementById('keyboard-screen').style.display = 'none';
      if (this._memory.get(clientId).has('skbsCallback')) this._memory.get(clientId).get('skbsCallback')();
    }

    /**
     * Replaces semicolons, spaces, line breaks, quotes, commas and periods to html equivalent
     */
    plainTextToHtml(txt) {
      if (txt == null || txt == undefined) return '';
      return txt.replace(/;/g, "&semi;").replace(/ /g, "&nbsp;").replace(/\n/g, "<br>").replace(/\"/g, "&quot;").replace(/,/g, "&comma;").replace(/\./g, "&period;");
    }

    getClipboard(clientId) {
      if (!this.activeClient(clientId)) return;
      return this.memoryRetrieve(clientId, PhoneV2Services.KEYBOARD_CLIP);
    }

    registeredServices(clientId) {
      let me = this;
      let v2Services = {
        showKeyboardScreen: (txt, callback) => me.showKeyboardScreen(clientId, txt, callback), 
        hideKeyboardScreen: () => me.hideKeyboardScreen(clientId), 
        plainTextToHtml: (txt) => me.plainTextToHtml(txt), 
        getClipboard: () => me.getClipboard(clientId)
      };
      return {
        ...super.registeredServices(clientId), 
        ...v2Services
      };
    }
  }

  PhoneV2Services.KEYBOARD_CLIP = 'keyboardClip';

  customElements.define('m-phone-v2', PhoneV2Element);
})(); 