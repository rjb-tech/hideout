import { SecondOscillatorParams } from "./secondOscillator";
import { WaveformParams } from "./waveform";

import styles from "./oscillators.module.scss";

export const SynthOscillatorParams = () => {
  return (
    <>
      <div className={styles.waveformSelector}>
        OSC1
        <WaveformParams />
      </div>
      <div className={styles.osc2}>
        OSC2
        <SecondOscillatorParams />
      </div>
    </>
  );
};
