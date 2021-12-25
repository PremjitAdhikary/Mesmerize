const menuScroll = (function () {
  let sounds = [];
  for (let i=0; i<3; i++) {
    let menuAudio = new Tone.PolySynth().toDestination();
    menuAudio.volume.value = -3;
    sounds.push(menuAudio);
  }
  let index = 0;
  return () => {
    try {
      sounds[index].triggerAttackRelease("Eb3", "32n");
    } catch(err) {
      console.error('menu move miss');
    } finally {
      index = index++%sounds.length;
    }
  };
})();

const bulletFire = (function () {
  let sounds = [];
  for (let i=0; i<10; i++) {
    let bulletAudio = new Tone.MembraneSynth().toDestination();
    bulletAudio.volume.value = -1;
    sounds.push(bulletAudio);
  }
  let index = 0;
  return () => {
    try {
      sounds[index].triggerAttackRelease("F1", "4n");
    } catch(err) {
      console.error('bullet fire miss');
    } finally {
      index = index++%sounds.length;
    }
  };
})();

const explodeBlast = (function () {
  let sounds = [];
  for (let i=0; i<10; i++) {
    let sound = {
      one: new Tone.MembraneSynth().toDestination(),
      two: new Tone.MembraneSynth().toDestination()
    };
    sound.one.volume.value = 2;
    sound.two.volume.value = 1;
    sounds.push(sound);
  }
  let index = 0;
  return () => {
    try {
      sounds[index].one.triggerAttackRelease("A1", "2n");
      sounds[index].two.triggerAttackRelease("F1", "4n");
    } catch(err) {
      console.error('explode blast miss');
    } finally {
      index = index++%sounds.length;
    }
  };
})();

const getSong = (function () {
  const synthSmash = new SynthSmash();
  const bassSmash = new BassSmash();
  return () => {
    return manager.isCurrent(PlayCommander) ? bassSmash : synthSmash;
  }
})();