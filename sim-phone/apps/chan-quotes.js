class ChanQuotes extends PhoneApp {

  constructor() {
    super('NM-Quotes', '/sim-phone/img/app-icons/quotes.png');
  }

  launch() {
    this._services.showLoadingScreen();
    fetch('https://yurippe.vercel.app/api/quotes?random=1')
      .then(response => response.json())
      .then(quote => {
        this._services.hideLoadingScreen();
        let q = quote[0].character + ' (from ' + quote[0].show + ') says "' + quote[0].quote + '".';
        this._services.showMessage(q, () => this._services.hideApp());
      })
      .catch(error => {
        this._services.hideLoadingScreen();
        let e = 'API endpoint yurippe.vercel.app is not responsive.'
        console.error(e, error);
        this._services.showMessage(e, () => this._services.hideApp());
      });
    return super.launch();
  }
  
}