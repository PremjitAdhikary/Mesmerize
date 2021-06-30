import { bus } from '../components/event-bus.js';

setBus(bus);

let nearBar;
let nearCar;
let debugOn = false;
let coolOn = false;
let currDb = '';

function setupApps() {
  nearBar = new NearBar();
  nearCar = new NearCar();

  document.getElementById('loc-phone').registerApp(nearBar);
  document.getElementById('loc-phone').registerApp(nearCar);

  document.getElementById('loc-phone').services.registerEvent('FindJoints', 
    e => bus.dispatch('SketchFJ', { range: e.range }));

  document.getElementById('loc-phone').services.registerEvent('AppLaunched', 
    e => {
      bus.dispatch('SketchAL', { app: e.app, db: e.db });
      currDb = e.db;
      renderCoolBtn();
    });

  document.getElementById('loc-phone').services.registerEvent('AppClosed', 
    e => {
      bus.dispatch('SketchAC', { });
      currDb = '';
      renderCoolBtn();
  });

  document.getElementById('loc-phone').services.registerEvent('FindCars', 
    e => bus.dispatch('SketchFC', { range: e.range }));
}

function setupSketchEvents() {
  bus.register('SketchPM', e => {
    let position = e.detail.position;
    let bg = e.detail.bg;
    let isLand = e.detail.isLand;
    document.getElementById('loc-phone').services.dispatchEvent(
      'UpdateLocation', { position, bg, isLand });
  });
  bus.register('SketchFJR', e => {
    document.getElementById('loc-phone').services.dispatchEvent(
      'FoundJoints', { foundJoints: e.detail.foundJoints });
  });
  bus.register('SketchFCR', e => {
    document.getElementById('loc-phone').services.dispatchEvent(
      'FoundCars', { foundCabs: e.detail.foundCabs });
  });
}

document.getElementById('debug_btn').innerHTML = 'Debug On';

document.getElementById('debug_btn').onclick = e => {
  debugOn = !debugOn;
  bus.dispatch("ControlLBSd", { debugOn });
  document.getElementById('debug_btn').innerHTML = debugOn ? 'Debug Off':'Debug On';
  if (!debugOn) coolOn = false;
  renderCoolBtn();
  actCoolBtn();
};

document.getElementById('cool_btn').innerHTML = 'Cool On';

document.getElementById('cool_btn').onclick = e => {
  coolOn = !coolOn;
  actCoolBtn();
};

setupApps();
setupSketchEvents();

function renderCoolBtn() {
  let enabled = debugOn && currDb && currDb === 'hc';
  document.getElementById('cool_holder').style.display = enabled ? 'inline-block' : 'none';
}

function actCoolBtn() {
  bus.dispatch("ControlLBSc", { coolOn });
  document.getElementById('cool_btn').innerHTML = coolOn ? 'Cool Off':'Cool On';
}

renderCoolBtn();