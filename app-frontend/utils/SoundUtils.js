const soundStore = {};

function createSound(soundSrc) {
  const sound = document.createElement("audio");
  sound.src = `/sounds/${soundSrc}.mp3`;
  sound.preload = true;
  return sound;
}

export function playSound(name, volume = 1) {
  let sound = soundStore[name];
  if (!sound) {
    sound = createSound(name);
    soundStore[name] = sound;
  }
  sound.volume = volume;
  sound.load();
  sound.play();
}
