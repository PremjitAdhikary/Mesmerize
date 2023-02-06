/**
 * Works as a wrapper on the shared EventBus component
 * Keeps track of all game events that registers into the event-bus
 * Has an api to degister all the game events (has to be called on game exit)
 */
class GameEventBus {

  constructor(eventBus) {
    this._bus = eventBus;
    this.eventsAddedMap = new Map();
  }

  updateGameId(gameId) {
    this.gameId = gameId;
  }

  generateEventId(eventName) {
    return this.gameId + '_' + eventName;
  }

  register(eventName, callback) {
    let ename = this.generateEventId(eventName);
    this.eventsAddedMap.set(ename, callback);
    this._bus.register(ename, callback);
  }

  deregister(eventName, callback) {
    let ename = this.generateEventId(eventName);
    this.eventsAddedMap.delete(ename);
    this._bus.deregister(ename, callback);
  }

  deregisterAll() {
    this.eventsAddedMap.forEach((callback, ename) => {
      this._bus.deregister(ename, callback);
    });
    this.eventsAddedMap.clear();
  }

  dispatch(eventName, detail) {
    this._bus.dispatch(this.generateEventId(eventName), detail);
  }

}