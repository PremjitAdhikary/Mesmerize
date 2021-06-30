class MCalendar extends PhoneApp {

  constructor() {
    super('M-Calendar', '/sim-phone/img/app-icons/calendar.png');
    this._now = new Date();
  }

  build() {
    super.build();
    this.buildHeader();
    this.buildTable();
  }

  postBuild() {
    this._services.registerEvent('Notify', e => 
      this._services.showMessage('From Calendar: ' + e.mess));
  }

  buildHeader() {
    this._appRoot.style.backgroundColor = 'rgb(232, 247, 230)';
    let header = document.createElement('div');
    header.append(document.createTextNode(this.getMonthAndYear()));
    this.css(header, MCalendar.H_STYLE);
    this._appRoot.appendChild(header);
  }

  buildTable() {
    let tableH = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let table = document.createElement('table');
    let tr = document.createElement('tr');
    for (let day of tableH) {
      let th = document.createElement('th');
      th.append(document.createTextNode(day));
      if (day != 'S') th.style.color = 'green';
      tr.appendChild(th);
    }
    table.appendChild(tr);
    table.style.width = '100%';

    let i = 0;
    
    for (let d = 1 - this.firstDayOfThisMonth(); d <= this.daysInThisMonth(); d++) {
      if (i==0) 
        tr = document.createElement('tr');
      let td = document.createElement('td');
      td.append(document.createTextNode( (d <= 0) ? ' ' : ''+d) );
      td.style.textAlign = 'center';
      if (d == this._now.getDate()) 
        this.css(td, { color: 'green', fontWeight: 'bold' } );
      tr.appendChild(td);
      if (i==6) {
        table.appendChild(tr);
        i = 0;
      } else 
        i++;
    }
    if (i != 0) {
      table.appendChild(tr);
    }

    this._appRoot.appendChild(table);
  }

  firstDayOfThisMonth() {
    let today = this._now.getDay();
    let toDate = this._now.getDate();
    return (today - toDate%7 + 8) % 7;
  }

  getMonthAndYear() {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
      'September', 'October', 'November', 'December'];
    return months[this._now.getMonth()]  + ' ' + this._now.getFullYear();
  }

  daysInThisMonth() {
    let month = this._now.getMonth();
    if (month == 1) {
      let yr = this._now.getFullYear();
      return (yr % 4 == 0 && yr % 100 != 0) || (yr % 100 == 0 && yr % 400 == 0) ? 29 : 28;
    }
    let totalDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return totalDays[month];
  }
  
}

MCalendar.H_STYLE = {
  textAlign: 'center',
  lineHeight: '90px',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontVariant: 'small-caps',
  fontWeight: 'bolder',
  color: 'green',
  height: '25%'
};
