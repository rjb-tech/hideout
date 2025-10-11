import { EnvelopeParams } from "./envelope/envelope";
import { FilterParams } from "./filter";
import { SpaceParams } from "./space";

import styles from "./params.module.scss";
import { SynthSequencer } from "./sequencer";
import { SynthLfo } from "./lfo";
import { SynthOscillatorParams } from "./oscillators";

export const SynthParams = () => {
  return (
    <>
      <div className={styles.top}>
        <SynthSequencer />
        <SynthOscillatorParams />
      </div>
      <div className={styles.middle}>
        <EnvelopeParams />
        <SpaceParams />
      </div>
      <div className={styles.bottom}>
        <FilterParams />
        <SynthLfo />
      </div>
    </>
  );
};
