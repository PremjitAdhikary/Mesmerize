class SynthSmash {

  constructor() {
    this.counter = 0;
    this.setCount = 0;
    this.masterCount = 0;
    this.halfCount = 0;

    this.synth = new Tone.PolySynth().toDestination();
    this.synthTrack = [
      ["Bb1", "Bb2"], ["Bb1", "Bb2"], ["F3", "F2"], null, ["Eb3", "Eb2"], null, ["Db3", "Db2"], null, 
      ["Bb1", "Bb2"], null, ["Db3", "Db2"], null, ["Eb3", "Eb2"], null, ["F3", "F2"], null
    ];
    this.synthNoteDuration = 0.25;

    this.amSynth = new Tone.AMSynth().toDestination();
    this.amTrack = ["Bb4", "C4", "Db4", "Eb4"];
    this.amNoteDuration = 1.6;

    this.bass = new Tone.PolySynth().toDestination();
    this.bassTrack = ["Bb2", "Ab2", "Gb2", "Ab2"];
    this.bassNoteDuration = 0.8;

    this.hiSynth = new Tone.PolySynth().toDestination();
    this.hiSynthTrack = [
      "F5", "Eb5", "F5", "Eb5", "F5", "Eb5", "F5", "Db5", 
      "Eb5", "Db5", "Eb5", "Db5", "Eb5", "Db5", "Eb5", "Bb4", 
      "Ab4", "Db5", "Ab4", "Db5", "Ab4", "Db5", "Ab4", "Db5", 
      "Bb4", "Eb4", "Bb4", "Eb4", "Bb4", "Eb5", "Bb4", "Eb5"
    ];
    this.hiSynthNoteDuration = 0.25;

    this.beat = new Tone.Loop(this.song, '16n');
  }

  start() {
    this.counter = 0;
    this.setCount = 0;
    this.masterCount = 0;
    this.halfCount = 0;
    Tone.Transport.bpm.value = 80;
    Tone.Transport.start();
    this.beat.start();
    this.loVolume();
  }

  stop() {
    this.beat.stop();
    Tone.Transport.stop();
  }

  song = (time) => {
    if (this.synthTrack[this.counter]) 
      this.synth.triggerAttackRelease(this.synthTrack[this.counter], this.synthNoteDuration, time);
    if (this.counter%4 == 0) {
      this.bass.triggerAttackRelease(this.bassTrack[this.setCount], this.bassNoteDuration, time);
      if (this.masterCount >= 2)
      this.amSynth.triggerAttackRelease(this.amTrack[this.setCount], this.amNoteDuration, time);
    }
    if (this.masterCount >= 4) 
      this.hiSynth.triggerAttackRelease(
        this.hiSynthTrack[this.halfCount], this.hiSynthNoteDuration, time);
    this.counter = (this.counter+1) % 16;
    this.halfCount = (this.halfCount+1) % 32;
    if (this.counter == 0) {
      this.setCount = (this.setCount+1) % 4;
      if (this.setCount == 0) {
        this.masterCount = (this.masterCount+1) % 8;
      }
    }
  }

  loVolume() {
    this.synth.volume.value = -6;
    this.bass.volume.value = 2;
    this.amSynth.volume.value = -11;
    this.hiSynth.volume.value = -11;
  }

  hiVolume() {
    this.synth.volume.value = -4;
    this.bass.volume.value = 4;
    this.amSynth.volume.value = -9;
    this.hiSynth.volume.value = -9;
  }

}