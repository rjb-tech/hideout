export type ActionDirection = "incr" | "decr";
export type ActionScope = "wave" | "filter" | "gain" | "octave";
export type ChromaticKeys = Record<string, ChromaticKey>;
export type ActionKeys = Record<string, ActionKey>;
export type HideoutWaveforms = "sine" | "triangle" | "sawtooth" | "square";
export type EnvelopeParameter = "attack" | "decay" | "sustain" | "release";
export type FilterType = "lowpass" | "highpass" | "bandpass";
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
  time: number | null;
  feedback: number;
}

export interface SynthReverb {
  decay: number | null;
  mix: number;
}

export interface SynthFilter {
  frequency: number; // hz
  type: FilterType;
  q: number; // quality factor
  envelopeLink: boolean;
}

export interface SynthSettings {
  envelope: EnvelopeValue;
  gain: number;
  octave: number;
  waveform: HideoutWaveforms;
  delay: SynthDelay;
  reverb: SynthReverb;
  filter: SynthFilter;
  secondOscOn: boolean;
  sequencer: SynthSequencerParams;
  metronomeOn: boolean;
  lfo: SynthLfoParams;
}

export interface SynthSequencerParams {
  bpm: number;
  notes: (number | null)[];
  playing: boolean;
  recording: boolean;
  activeStep: number;
  numSteps: number;
}

export interface SynthLfoParams {
  depth: number;
  speed: number;
  bpmLink: boolean;
  engaged: boolean;
}
