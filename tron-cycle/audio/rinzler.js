class Rinzler {

  constructor() {
    this._counter = 0;
    this._setCount = 0;
    this._noteDuration = 0.03;

    this._synthLo = new Tone.PolySynth().toDestination();
    this._synthLo.volume.value = 5;
    this._synthHi = new Tone.PolySynth().toDestination();
    this._synthHi.volume.value = -3;

    this._beat = new Tone.Loop(this.song, '16n');
    Tone.Transport.bpm.value = 90;
  }

  start() {
    Tone.Transport.start();
    this._beat.start();
  }

  stop() {
    this._beat.stop();
    Tone.Transport.stop();
  }

  song = (time) => {
    if (this._counter < 8)
      this._synthLo.triggerAttackRelease(["A1", "A2"], this._noteDuration, time);
    else if (this._counter < 16)
      this._synthLo.triggerAttackRelease(["G1", "G2"], this._noteDuration, time);
    else
      this._synthLo.triggerAttackRelease(["E1", "E2"], this._noteDuration, time);

    if (this._setCount >= 12) {
      if (this._counter % 8 == 0 || this._counter % 8 == 1)
        this._synthHi.triggerAttackRelease(["E4"], this._noteDuration, time);
      else if (this._counter % 8 == 4 || this._counter % 8 == 5)
        this._synthHi.triggerAttackRelease(["C4"], this._noteDuration, time);
      else if (this._counter % 4 == 2)
        this._synthHi.triggerAttackRelease(["E3"], this._noteDuration, time);
      else if (this._counter % 4 == 3)
        this._synthHi.triggerAttackRelease(["G2", "G3"], this._noteDuration, time);
    } else if (this._setCount >= 8) {
      if (this._counter % 8 == 0)
        this._synthHi.triggerAttackRelease(["E4"], this._noteDuration*2, time);
      else if (this._counter % 8 == 4)
        this._synthHi.triggerAttackRelease(["C4"], this._noteDuration*2, time);
    
      if (this._counter > 16 && this._counter % 4 == 2)
        this._synthHi.triggerAttackRelease(["E3"], this._noteDuration, time);
      else if (this._counter > 16 && this._counter % 4 == 3)
        this._synthHi.triggerAttackRelease(["G2", "G3"], this._noteDuration, time);
    } else if (this._setCount >= 4) {
      if (this._counter % 8 == 0)
        this._synthHi.triggerAttackRelease(["E4"], this._noteDuration*2, time);
      else if (this._counter % 8 == 4)
        this._synthHi.triggerAttackRelease(["C4"], this._noteDuration*2, time);
    }
  
    this._counter = (this._counter+1)%32;
    if (this._counter == 0) {
      this._setCount = (this._setCount+1)%16;
    }
  }
}