export type ActionDirection = "incr" | "decr";
export type ActionScope = "wave" | "filter" | "gain" | "octave";
export type ChromaticKeys = Record<string, ChromaticKey>;
export type ActionKeys = Record<string, ActionKey>;
export type HideoutWaveforms = "sine" | "triangle" | "sawtooth" | "square";
export type EnvelopeParameter = "attack" | "decay" | "sustain" | "release";
export type EnvelopeValue = Record<EnvelopeParameter, number>;

export interface ChromaticKey {
  note: string;
  baseFrequency: number;
}

export interface ActionKey {
  scope: ActionScope;
  direction: ActionDirection;
}

export interface SynthDelay {
  on: boolean;
  time: number;
  feedback: number;
}

export interface SynthReverb {
  on: boolean;
  mix: number;
}

export interface SynthSettings {
  envelope: EnvelopeValue;
  gain: number;
  octave: number;
  waveform: HideoutWaveforms;
  delay: SynthDelay;
  reverb: SynthReverb;
}
