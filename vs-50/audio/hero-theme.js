class HeroTheme {

  constructor() {
    this.counter = 0;
    this.setCount = 0;

    let ab = { note: ["Ab3", "A2"], duration: 0.2 };
    let b = { note: ["B3", "B2"], duration: 0.2 };
    let db = { note: ["Db4", "D3"], duration: 0.2 };
    let e = { note: ["E4", "E3"], duration: 0.2 };
    let eb = { note: ["Eb4", "E3"], duration: 0.2 };
    let gb = { note: ["Gb4", "G3"], duration: 0.2 };

    this.synth = new Tone.PolySynth().toDestination();
    this.synthTrackRise = [
      ab, eb, db, b, 
      ab, e, eb, db, 
      ab, gb, e, eb
    ];
    this.synthTrackDrop = [
      ab, b, eb, db, 
      null, ab, b, db, 
      b, null, ab, b,  
      db, b, null, null
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
    if (this.counter < 4 && this.setCount < 6) {
      let synthIndex = Math.floor(this.setCount/2)*4 + this.counter;
      this.synth.triggerAttackRelease(this.synthTrackRise[synthIndex].note, 
        this.synthTrackRise[synthIndex].duration, time);
    }
    if (this.setCount == 6) {
      if (this.synthTrackDrop[this.counter] != null) {
        this.synth.triggerAttackRelease(this.synthTrackDrop[this.counter].note, 
          this.synthTrackDrop[this.counter].duration, time);
      }
    }

    if (this.setCount < 6 && (this.counter == 8 || this.counter == 11)) 
      this.drum.triggerAttackRelease("A2", "2n", time);
    else 
      this.drum.triggerAttackRelease("C1", "2n", time);
  
    this.counter = (this.counter+1) % 16;
    if (this.counter == 0) {
      this.setCount = (this.setCount+1) % 8;
    }
  };

}