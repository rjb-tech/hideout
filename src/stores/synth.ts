import { map, type PreinitializedMapStore } from "nanostores";

import { GAIN_MAX } from "@constants/synth";
import type { SynthSettings } from "@hideoutTypes/synth";

export const SYNTH_LOCAL_STORAGE_KEY = "synth_settings";

const existingSettings = JSON.parse(
  window.sessionStorage.getItem(SYNTH_LOCAL_STORAGE_KEY) ?? "{}",
) as SynthSettings;

export const synthParamsStore: PreinitializedMapStore<SynthSettings> = map({
  gain: existingSettings.gain ?? GAIN_MAX,
  octave: existingSettings.octave ?? 2,
  waveform: existingSettings.waveform ?? "sawtooth",
  envelope: existingSettings.envelope ?? {
    attack: 0,
    decay: 15,
    sustain: 0,
    release: 0,
  },
  delay: existingSettings.delay ?? {
    time: null,
    feedback: 0, // not working
  },
  reverb: existingSettings.reverb ?? {
    decay: null,
    mix: 0.4,
  },
  filter: existingSettings.filter ?? {
    frequency: 20000,
    type: "lowpass",
    q: 0,
    envelopeLink: false,
  },
  secondOscOn: existingSettings.secondOscOn ?? false,
  sequencer: {
    bpm: existingSettings?.sequencer?.bpm ?? 120,
    notes: [],
    playing: false,
    recording: false,
    activeStep: 0,
    numSteps: 8,
  },
  metronomeOn: false,
});
