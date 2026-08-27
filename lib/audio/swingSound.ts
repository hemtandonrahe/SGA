"use client";

// A shared <audio> instance + a page-wide "has the visitor interacted yet" flag.
// Browsers block audio.play() before any user gesture — a direct click handler
// (a CTA, a form submit) is itself a gesture and plays immediately either way;
// the hero animation's autonomous loop is not, so it stays silent until this
// flips true, then plays on every loop for the rest of the visit.
const SWING_SOUND_SRC = "/sounds/swing.mp3";

let sharedAudio: HTMLAudioElement | null = null;
let interacted = false;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio(SWING_SOUND_SRC);
    sharedAudio.preload = "auto";
    sharedAudio.volume = 0.6;
  }
  return sharedAudio;
}

if (typeof window !== "undefined") {
  const unlock = () => {
    interacted = true;
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

export function hasUserInteracted() {
  return interacted;
}

export function playSwingSound() {
  const audio = getAudio();
  if (!audio) return;
  try {
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Blocked by autoplay policy — fine, it's a nice-to-have, not required.
    });
  } catch {
    // Ignore — same reasoning as above.
  }
}
