// Sound effects using audio files

const sounds = {
  before: null,
  correct: null,
  wrong: null,
  suspense: null,
  final: null,
};

// Preload all sounds
const preloadSounds = () => {
  if (!sounds.before) {
    sounds.before = new Audio('/sounds/before.mp3');
    sounds.correct = new Audio('/sounds/correct.mp3');
    sounds.wrong = new Audio('/sounds/wrong.mp3');
    sounds.suspense = new Audio('/sounds/suspense.mp3');
    sounds.final = new Audio('/sounds/final.mp3');

    // Suspense loops
    sounds.suspense.loop = true;
  }
};

// Before game starts
export const playBeforeSound = () => {
  try {
    preloadSounds();
    sounds.before.currentTime = 0;
    sounds.before.play();
  } catch {
    console.log('Sound not available');
  }
};

// Correct answer
export const playCorrectSound = () => {
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
  try {
    preloadSounds();
    sounds.final.currentTime = 0;
    sounds.final.play();
  } catch {
    console.log('Sound not available');
  }
};

// Stop all sounds
export const stopAllSounds = () => {
  try {
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
