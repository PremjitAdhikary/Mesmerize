let mesNotes;
let mAgination;

function setupApps() {
  mesNotes = new MesNotes();
  document.getElementById('mes-phone').registerApp(mesNotes);
  mAgination = new MAgination();
  document.getElementById('mes-phone').registerApp(mAgination);
}

setupApps();