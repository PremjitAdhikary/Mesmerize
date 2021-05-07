/**
 * Got this from an article:
 * https://www.devbridge.com/articles/tonejs-coding-music-production-guide/
 */
class Snare {

  constructor(vol) {
    let lowPass = new Tone.Filter({
      frequency: 11000
    }).toDestination();

    this._snareDrum = new Tone.NoiseSynth({
      volume: vol,
      noise: {
        type: 'white',
        playbackRate: 1
      },
      envelope: {
        attack: 0.001,
        decay: 0.20,
        sustain: 0.15,
        release: 0.5,
      }
    }).connect(lowPass);
  }

  trigger(beats, time) {
    this._snareDrum.triggerAttackRelease(beats, time);
  }
}