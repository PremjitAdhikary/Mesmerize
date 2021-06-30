document.getElementById('ph-event').onclick = e => {
  document.getElementById('mes-phone').services.dispatchEvent(
    'Notify', { mess: 'Notification from Page' });
};

let mesTube;
let mCalendar;
let quotes;
let mesPaint;

function setupApps() {
  mCalendar = new MCalendar();
  document.getElementById('mes-phone').registerApp(mCalendar);

  mesTube = new MesTube();
  document.getElementById('mes-phone').registerApp(mesTube);

  quotes = new ChanQuotes();
  document.getElementById('mes-phone').registerApp(quotes);

  mesPaint = new MesPaint();
  document.getElementById('mes-phone').registerApp(mesPaint);
}

setupApps();