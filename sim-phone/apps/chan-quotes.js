class ChanQuotes extends PhoneApp {

  constructor() {
    super('NM-Quotes', '/sim-phone/img/app-icons/quotes.png');
  }

  launch() {
    this._services.showLoadingScreen();
    fetch('https://animechan.vercel.app/api/random')
      .then(response => response.json())
      .then(quote => {
        this._services.hideLoadingScreen();
        let q = quote.character + ' (from ' + quote.anime + ') says "' + quote.quote + '".';
        this._services.showMessage(q, () => this._services.hideApp());
      })
      .catch(error => {
        this._services.hideLoadingScreen();
        let e = 'Animchan is not responsive.'
        console.error(e, error);
        this._services.showMessage(e, () => this._services.hideApp());
      });
    return super.launch();
  }
  
}