import { map, type PreinitializedMapStore } from "nanostores";

import { GAIN_MAX } from "@components/synth/constants";
import type { SynthSettings } from "@hideoutTypes/synth";

export const SYNTH_LOCAL_STORAGE_KEY = "synth_settings";

export const synthParamsStore: PreinitializedMapStore<SynthSettings> = map({
  gain: GAIN_MAX,
  octave: 2,
  waveform: "sawtooth",
  envelope: {
    attack: 0,
    decay: 15,
    sustain: 0,
    release: 0,
  },
  delay: {
    time: null,
    feedback: 0, // not working
  },
  reverb: {
    decay: null,
    mix: 0.4,
  },
  filter: {
    frequency: 20000,
    type: "lowpass",
    q: 0,
    envelopeLink: false,
  },
  secondOscOn: false,
});
