import { EnvelopeParams } from "./envelope/envelope";
import { FilterParams } from "./filter";
import { SecondOscillatorParams } from "./secondOscillator";
import { SpaceParams } from "./space";
import { WaveformParams } from "./waveform";

import styles from "./params.module.scss";

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
      <div className={styles.bottom}>
        <EnvelopeParams />
        <SpaceParams />
      </div>
    </>
  );
};
