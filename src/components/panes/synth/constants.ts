import type {
  ActionKeys,
  ChromaticKeys,
  HideoutWaveforms,
} from "@hideoutTypes/synth";

export const chromaticKeys: ChromaticKeys = {
  KeyA: { note: "C", baseFrequency: 65.41 },
  KeyW: { note: "C#/Db", baseFrequency: 69.3 },
  KeyS: { note: "D", baseFrequency: 73.42 },
  KeyE: { note: "D#/Eb", baseFrequency: 77.78 },
  KeyD: { note: "E", baseFrequency: 82.41 },
  KeyF: { note: "F", baseFrequency: 87.31 },
  KeyT: { note: "F#/Gb", baseFrequency: 92.5 },
  KeyG: { note: "G", baseFrequency: 98.0 },
  KeyY: { note: "G#/Ab", baseFrequency: 103.83 },
  KeyH: { note: "A", baseFrequency: 110.0 },
  KeyU: { note: "A#/Bb", baseFrequency: 116.54 },
  KeyJ: { note: "B", baseFrequency: 123.47 },
  KeyK: { note: "C", baseFrequency: 130.81 },
  KeyO: { note: "C#/Db", baseFrequency: 138.59 },
  KeyL: { note: "D", baseFrequency: 146.83 },
  KeyP: { note: "D#/Eb", baseFrequency: 155.56 },
  Semicolon: { note: "E", baseFrequency: 164.81 },
};

export const actionKeys: ActionKeys = {
  ArrowLeft: { scope: "wave", direction: "decr" },
  ArrowRight: { scope: "wave", direction: "incr" },
  ArrowUp: { scope: "octave", direction: "incr" }, // change these to octave
  ArrowDown: { scope: "octave", direction: "decr" }, // change these to octave
};

export const GAIN_MAX = 0.2;

export const waveforms: HideoutWaveforms[] = [
  "sine",
  "triangle",
  "sawtooth",
  "square",
];
