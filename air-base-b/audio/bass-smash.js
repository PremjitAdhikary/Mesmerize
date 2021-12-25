class BassSmash {

  constructor() {
    this.counter = 0;
    this.setCount = 0;

    this.synth = new Tone.PolySynth().toDestination();
    this.synthTrack = [
      { note: ["F#1"], duration: 0.05 }, 
      { note: ["A1"], duration: 0.2 }, 
      { note: ["Ab1"], duration: 0.2 } 
    ];

    this.drum = new Tone.MembraneSynth().toDestination();

    this.beat = new Tone.Loop(this.song, '16n');
  }

  start() {
    this.counter = 0;
    this.setCount = 0;
    Tone.Transport.bpm.value = 95;
    Tone.Transport.start();
    this.beat.start();
    this.loVolume();
  }

  stop() {
    this.beat.stop();
    Tone.Transport.stop();
  }

  song = (time) => {
    if (this.counter == 1) 
      this.synth.triggerAttackRelease(this.synthTrack[1].note, this.synthTrack[1].duration, time);
    else if (this.counter == 3) 
      this.synth.triggerAttackRelease(this.synthTrack[2].note, this.synthTrack[2].duration, time);
    else if (!(this.setCount == 3 && this.counter % 4 == 3))
      this.synth.triggerAttackRelease(this.synthTrack[0].note, this.synthTrack[0].duration, time);

    if (this.counter % 4 == 0) 
      this.drum.triggerAttackRelease("C1", "2n", time);
    
    this.counter = (this.counter+1) % 16;
    if (this.counter == 0) {
      this.setCount = (this.setCount+1) % 4;
    }
  };

  loVolume() {
    this.synth.volume.value = 1;
    this.drum.volume.value = -5;
  }

  hiVolume() {
    this.synth.volume.value = 3;
    this.drum.volume.value = -3;
  }

}