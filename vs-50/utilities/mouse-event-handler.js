/**
 * For a left-click, p5js gives out 3 events:
 * 1) mousePressed
 * 2) mouseReleased
 * 3) mouseClicked
 * For a right-click, p5js gives out 2 events:
 * 1) mousePressed
 * 2) mouseReleased
 * For a double-click, well:
 * 1) mousePressed
 * 2) mouseReleased
 * 3) mouseClicked
 * 4) mousePressed
 * 5) mouseReleased
 * 6) mouseClicked
 * 7) doubleClicked
 * 
 * In this game, which is driven by mouse, we have following events to act upon:
 * 1) left button down
 * 2) left button up
 * 3) left click
 * 4) right click
 * 
 * This handler is written to facilitate that. 
 * The caller passes all the captured mouse events to this handler and registers the events 
 * it wants to handle with a delay (after which to handle).
 * 
 * The handler captures all the passed events into an internal queue which it starts to process 
 * adter the configured delay.
 */
 class MouseEventHandler {

  constructor(delay) {
    this.delay = delay;
    this.delayedEvent = intervalCaller(() => this.delay, () => this.dispatchEvents());
    this.delayedEventSet = false;
    this.eventQueue = [];
    this.downListeners = [];
    this.upListeners = [];
    this.leftClickListeners = [];
    this.rightClickListeners = [];
    this.doubleClickListeners = [];
  }

  run() {
    this.delayedEvent();
  }

  // dispatches the event(s) from the queue to their respective registered listeners
  dispatchEvents() {
    if (this.delayedEventSet) {
      this.delayedEventSet = false;
      return true; // starts countdown
    }
    this.processEventQueue();
    this.eventQueue = [];
    return false;
  }

  // reads the queue to analyze the final events to be dispatched and then fire them
  processEventQueue() {
    let downEvent = {
      validate: [EventTypes.LD],
      fire: () => this.downListeners.forEach( dl => dl() )
    };
    let upEvent = {
      validate: [EventTypes.LU],
      fire: () => this.upListeners.forEach( ul => ul() )
    };
    let leftClickEvent = {
      validate: [EventTypes.LD, EventTypes.LU], 
      fire: () => this.leftClickListeners.forEach( lcl => lcl() )
    };
    let rightClickEvent = {
      validate: [EventTypes.RD, EventTypes.RU], 
      fire: () => this.rightClickListeners.forEach( lcl => lcl() )
    };
    let doubleClickEvent = {
      validate: [EventTypes.LD, EventTypes.LU, EventTypes.LD, EventTypes.LU], 
      fire: () => this.doubleClickListeners.forEach( lcl => lcl() )
    };
    let upThenLeftClickEvent = {
      validate: [EventTypes.LU, EventTypes.LD, EventTypes.LU], 
      fire: () => {
        this.upListeners.forEach( ul => ul() );
        this.leftClickListeners.forEach( lcl => lcl() );
      }
    };
    let upThenRightClickEvent = {
      validate: [EventTypes.LU, EventTypes.RD, EventTypes.RU], 
      fire: () => {
        this.upListeners.forEach( ul => ul() );
        this.rightClickListeners.forEach( lcl => lcl() );
      }
    };
    let leftClickThenDownEvent = {
      validate: [EventTypes.LD, EventTypes.LU, EventTypes.LD], 
      fire: () => {
        this.leftClickListeners.forEach( lcl => lcl() );
        this.downListeners.forEach( ul => ul() );
      }
    };
    let rightClickThenDownEvent = {
      validate: [EventTypes.RD, EventTypes.RU, EventTypes.LD], 
      fire: () => {
        this.rightClickListeners.forEach( lcl => lcl() );
        this.downListeners.forEach( ul => ul() );
      }
    };

    let processableEvents = [
      downEvent, upEvent, leftClickEvent, rightClickEvent, doubleClickEvent, 
      upThenLeftClickEvent, upThenRightClickEvent, leftClickThenDownEvent, rightClickThenDownEvent
    ];
    let eventToProcess = processableEvents.find( ev => {
      if (this.eventQueue.length != ev.validate.length) return false;
      for (let i=0; i<this.eventQueue.length; i++) {
        if (this.eventQueue[i].type != ev.validate[i]) return false;
      }
      return true;
    });
    if (eventToProcess) eventToProcess.fire();
  }

  // capture mouse down event and push to internal event queue
  down() {
    if (this.eventQueue.length == 0) {
      this.delayedEventSet = true;
    }
    this.eventQueue.push({
      type: (mouseButton == 'left' ? EventTypes.LD : EventTypes.RD), time: Date.now()
    });
  }

  // capture mouse up event and push to internal event queue
  up() {
    if (this.eventQueue.length == 0) {
      this.delayedEventSet = true;
    }
    this.eventQueue.push({
      type: (mouseButton == 'left' ? EventTypes.LU : EventTypes.RU), time: Date.now()
    });
  }

  clicked() { } // ignore as this will be processed based on consecutive mouse down and up events

  doubleClicked() { } //ignore as this will be processed based on consecutive mouse clicks

  // register/deregister listeners
  removeElementFromArray(arr, elem) {
    let idx = arr.indexOf(elem);
    if (idx > -1) {
      arr.splice(idx, 1);
    }
    return arr;
  }

  registerMouseDown(listener) {
    this.downListeners.push(listener);
  }
  deregisterMouseDown(listener) {
    this.removeElementFromArray(this.downListeners, listener);
  }

  registerMouseUp(listener) {
    this.upListeners.push(listener);
  }
  deregisterMouseUp(listener) {
    this.removeElementFromArray(this.upListeners, listener);
  }

  registerLeftClick(listener) {
    this.leftClickListeners.push(listener);
  }
  deregisterLeftClick(listener) {
    this.removeElementFromArray(this.leftClickListeners, listener);
  }

  registerRightClick(listener) {
    this.rightClickListeners.push(listener);
  }
  deregisterRightClick(listener) {
    this.removeElementFromArray(this.rightClickListeners, listener);
  }

  registerDoubleClick(listener) {
    this.doubleClickListeners.push(listener);
  }
  deregisterDoubleClick(listener) {
    this.removeElementFromArray(this.doubleClickListeners, listener);
  }

}

class EventTypes {
  static LD = new EventTypes('left_down');  // left mouse button down
  static LU = new EventTypes('left_up');    // left mouse button up
  static RD = new EventTypes('right_down'); // right mouse button down
  static RU = new EventTypes('right_up');   // right mouse button up

  constructor(name) { this.name = name; }
}