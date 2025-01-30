export type ActionDirection = "incr" | "decr";
export type ActionScope = "wave" | "filter" | "gain" | "octave";
export type ChromaticKeys = Record<string, ChromaticKey>;
export type ActionKeys = Record<string, ActionKey>;
export type HideoutWaveforms = "sine" | "triangle" | "sawtooth" | "square";

export interface ChromaticKey {
  note: string;
  baseFrequency: number;
}

export interface ActionKey {
  scope: ActionScope;
  direction: ActionDirection;
}
