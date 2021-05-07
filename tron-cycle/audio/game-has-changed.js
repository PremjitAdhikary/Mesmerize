class GameHasChanged {

  constructor() {
    this._counter = 0;
    this._setCount = 0;
    this._noteDuration = 0.05;

    this._synth = new Tone.PolySynth().toDestination();
    this._synth.volume.value = -3;

    this._bass = new Tone.PolySynth().toDestination();
    this._bass.volume.value = 8;

    this._snare = new Snare(-6);

    this._drum = new Tone.MembraneSynth().toDestination();
    this._drum.volume.value = 10;

    this._beat = new Tone.Loop(this.song, '16n');
    Tone.Transport.bpm.value = 100;
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
    if (this._setCount >= 2) {
      let beat = this._counter % 16;
      if (beat == 0)
        this._synth.triggerAttackRelease("F4", this._noteDuration, time);
      else if ([2, 6, 8, 10].includes(beat))
        this._synth.triggerAttackRelease("E4", this._noteDuration, time);
      else if ([4, 12].includes(beat))
        this._synth.triggerAttackRelease("D4", this._noteDuration, time);
      else if (this._counter % 2 == 0)
        this._synth.triggerAttackRelease("C4", this._noteDuration, time);
    }

    if (this._counter % 2 == 0)
      this._bass.triggerAttackRelease("A1", this._noteDuration, time);

    if (([4, 5].includes(this._setCount) && this._counter == 0) || 
      ([6, 7].includes(this._setCount) && [0, 4, 8, 11, 13, 14].includes(this._counter)) || 
      (this._setCount == 8 && [0, 1, 3, 4, 6, 7, 10, 11, 12, 13, 14].includes(this._counter)) || 
      (this._setCount == 9 && [0, 1, 2, 4, 6, 8, 10, 12, 13, 14].includes(this._counter))) {
      this._drum.triggerAttackRelease("F1", "4n", time);
      this._snare.trigger('8n', time);
    }

    this._counter = (this._counter+1)%16;
    if (this._counter == 0) {
      this._setCount = (this._setCount+1)%10;
    }
  }

}