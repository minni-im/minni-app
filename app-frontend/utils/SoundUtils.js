let soundStore = {};

function createSound(soundSrc) {
  let sound = document.createElement("audio");
  sound.src = `/sounds/${soundSrc}.mp3`;
  sound.preload = true;
  return sound;
}

function playSound(name, volume=1) {
  let sound = soundStore[name];
  if (!sound) {
    sound = createSound(name);
    soundStore[name] = sound;
  }
  sound.volume = volume;
  sound.load();
  sound.play();
}

export default {
  playSound: playSound
};
