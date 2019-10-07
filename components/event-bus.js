class EventBus {
  constructor() {
    this._bus = document.createElement('div');
  }

  register(event, callback) {
    this._bus.addEventListener(event, callback);
  }

  remove(event, callback) {
    this._bus.removeEventListener(event, callback);
  }

  dispatch(event, detail = {}) {
    this._bus.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

export let bus = new EventBus();