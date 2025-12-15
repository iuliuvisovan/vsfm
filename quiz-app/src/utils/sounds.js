// Sound effects using audio files

let soundsEnabled = false;

const sounds = {
  before: null,
  gameStart: null,
  correct: null,
  wrong: null,
  suspense: null,
  final: null,
};

// Enable sounds (call after user interaction)
export const enableSounds = () => {
  soundsEnabled = true;
  preloadSounds();
  // Play a silent sound to unlock audio
  const unlock = new Audio();
  unlock.play().catch(() => {});
};

// Check if sounds are enabled
export const areSoundsEnabled = () => soundsEnabled;

// Preload all sounds
const preloadSounds = () => {
  if (!sounds.before) {
    sounds.before = new Audio('/sounds/before.mp3');
    sounds.gameStart = new Audio('/sounds/game-start.mp3');
    sounds.correct = new Audio('/sounds/correct.mp3');
    sounds.wrong = new Audio('/sounds/wrong.mp3');
    sounds.suspense = new Audio('/sounds/suspense.mp3');
    sounds.final = new Audio('/sounds/final.mp3');

    // Suspense loops
    sounds.suspense.loop = true;
  }
};

// Before game starts (player select screen)
export const playBeforeSound = () => {
  if (!soundsEnabled) return;
  try {
    preloadSounds();
    sounds.before.currentTime = 0;
    sounds.before.play();
  } catch {
    console.log('Sound not available');
  }
};

// Game start (when quiz begins)
export const playGameStartSound = () => {
  if (!soundsEnabled) return;
  try {
    preloadSounds();
    sounds.before.pause();
    sounds.gameStart.currentTime = 0;
    sounds.gameStart.play();
  } catch {
    console.log('Sound not available');
  }
};

// Correct answer
export const playCorrectSound = () => {
  if (!soundsEnabled) return;
  try {
    preloadSounds();
    stopSuspenseSound();
    sounds.correct.currentTime = 0;
    sounds.correct.play();
  } catch {
    console.log('Sound not available');
  }
};

// Wrong answer
export const playWrongSound = () => {
  if (!soundsEnabled) return;
  try {
    preloadSounds();
    stopSuspenseSound();
    sounds.wrong.currentTime = 0;
    sounds.wrong.play();
  } catch {
    console.log('Sound not available');
  }
};

// Suspense while question is displayed
export const playSuspenseSound = () => {
  if (!soundsEnabled) return;
  try {
    preloadSounds();
    sounds.suspense.currentTime = 0;
    sounds.suspense.play();
  } catch {
    console.log('Sound not available');
  }
};

// Stop suspense sound
export const stopSuspenseSound = () => {
  try {
    preloadSounds();
    sounds.suspense.pause();
    sounds.suspense.currentTime = 0;
  } catch {
    console.log('Sound not available');
  }
};

// Victory/final sound
export const playVictorySound = () => {
  if (!soundsEnabled) return;
  try {
    preloadSounds();
    sounds.final.currentTime = 0;
    sounds.final.play();
  } catch {
    console.log('Sound not available');
  }
};

// Stop all sounds and disable
export const stopAllSounds = () => {
  try {
    soundsEnabled = false;
    preloadSounds();
    Object.values(sounds).forEach((sound) => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  } catch {
    console.log('Sound not available');
  }
};
