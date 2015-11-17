let soundStore = {};

function createSound(soundSrc) {
  let sound = document.createElement("audio");
  sound.src = `/sounds/${soundSrc}.mp3`;
  sound.preload = true;
  return sound;
}

export function playSound(name, volume=1) {
  let sound = soundStore[name];
  if (!sound) {
    sound = createSound(name);
    soundStore[name] = sound;
  }
  sound.volume = volume;
  sound.play();
}
