class TrainingTheme {

  constructor() {
    this.counter = 0;
    this.setCount = 0;

    let ab = { note: ["Ab3", "A2"], duration: 0.2 };
    let bb = { note: ["Bb3", "B2"], duration: 0.2 };
    let c = { note: ["C4", "C3"], duration: 0.2 };
    let g = { note: ["G3", "G2"], duration: 0.2 };

    this.synth = new Tone.PolySynth().toDestination();
    this.synthTrackStart = [
      ab, null, null, null, 
      bb, null, null, null,  
      c, null, null, null,  
      c, null, null, null,  
      c, null, bb, null,  
      ab, null, g, null, 
      ab, null, null, null, 
      ab, null, null, null
    ];

    this.drum = new Tone.MembraneSynth().toDestination();

    this.beat = new Tone.Loop(this.song, '16n');
  }

  start() {
    this.counter = 0;
    this.setCount = 0;
    Tone.Transport.bpm.value = 80;
    Tone.Transport.start();
    this.beat.start();
    this.synth.volume.value = 1;
    this.drum.volume.value = -5;
  }

  stop() {
    this.beat.stop();
    Tone.Transport.stop();
  }

  song = (time) => {
    let idx = Math.floor(this.counter/2);
    if (this.synthTrackStart[idx] != null) {
      this.synth.triggerAttackRelease(this.synthTrackStart[idx].note, 
        this.synthTrackStart[idx].duration, time);
    }
  
    this.counter++;
    if (this.counter == 64) {
      this.synthTrackDone = this.mode == HeroTheme.MODE_ONLY_START ? false : true;
      this.counter = 0;
    }
  };

}