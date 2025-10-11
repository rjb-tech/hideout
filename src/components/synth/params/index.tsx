import { EnvelopeParams } from "./envelope/envelope";
import { FilterParams } from "./filter";
import { SecondOscillatorParams } from "./secondOscillator";
import { SpaceParams } from "./space";
import { WaveformParams } from "./waveform";

import styles from "./params.module.scss";
import { SynthSequencer } from "./sequencer";

export const SynthParams = () => {
  return (
    <>
      <div className={styles.top}>
        <FilterParams />
        <div className={styles.waveformSelector}>
          OSC1
          <WaveformParams />
        </div>
        <div className={styles.osc2}>
          OSC2
          <SecondOscillatorParams />
        </div>
      </div>
      <div className={styles.middle}>
        <EnvelopeParams />
        <SpaceParams />
      </div>
      <div className={styles.bottom}>
        <SynthSequencer />
      </div>
    </>
  );
};
