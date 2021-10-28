/**
 * Sound creates an audio element on the dom (that's what we play).
 * To avoid creating infinite elements on the dom and slowing it down to a crawl as time 
 * goes on, Object Pool Design Pattern to the rescue
 */
class SoundPool {

  constructor(src, size = 10) {
    this._pool = [];
    for (let s=0; s < size; s++) {
      this._pool.push(new Sound(src));
    }
    this._current = 0;
  }

  play() { 
    this._pool[this._current].play();
    this._current = (this._current+1) % this._pool.length;
  }

}