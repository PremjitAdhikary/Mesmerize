class ThemePartRemix {

  constructor() {
    this._counter = 0;
    this._setCount = 0;
    this._noteDuration = 0.05;

    this._tones = ['G3', 'F3', 'Eb3', 'D3', 'C3', 'D3', 'Eb3', 'F3'];
    this._hiTones = ['C4', 'Bb3', 'Ab3', 'G3', 'F3', 'G3', 'Ab3', 'Bb3'];

    this._synth = new Tone.Synth().toDestination();
    this._synth.volume.value = 3;
    this._bass = new Tone.MembraneSynth().toDestination();
    this._bass.volume.value = -15;
    this._drum = new Tone.MembraneSynth().toDestination();
    this._drum.volume.value = 8;

    this._beat = new Tone.Loop(this.song, '32n');
    Tone.Transport.bpm.value = 140;
  }

  start() {
    Tone.Transport.start();
    this._beat.start();
  }

  stop() {
    this._beat.stop();
    Tone.Transport.stop();
  }

  song = (time) =>{
    if (this._counter % 8 == 0)
      this._drum.triggerAttackRelease("F1", "4n", time);

    if (this._counter == 0) {
      this._synth.triggerAttackRelease(this._tones[Math.floor(this._setCount/2)], 
        this._noteDuration*2, time);
    } else if (this._counter == 7) {
      this._synth.triggerAttackRelease(this._tones[Math.floor(this._setCount/2)], 
        this._noteDuration*3, time);
    } else if (this._counter == 4) {
      this._synth.triggerAttackRelease(this._hiTones[Math.floor(this._setCount/2)], 
        this._noteDuration*3, time);
    } else if (this._counter % 8 == 4)
      this._bass.triggerAttackRelease("D3", "4n", time);
    
    this._counter = (this._counter+1)%32;
    if (this._counter == 0) {
      this._setCount = (this._setCount+1)%16;
    }
  }

}