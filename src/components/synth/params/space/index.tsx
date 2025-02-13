import { delayTimeOptions, reverbDecayOptions } from "../../constants";
import { Selector } from "./selector";

import styles from "./space.module.scss";

interface ISpaceParams {
  currentDelay: number | null;
  onDelayChange: (time: number | null) => void;
  currentReverb: number | null;
  onReverbChange: (decay: number | null) => void;
}

export const SpaceParams = ({
  currentDelay,
  onDelayChange,
  currentReverb,
  onReverbChange,
}: ISpaceParams) => {
  return (
    <div className={styles.container}>
      SPACE
      <div className={styles.selectorContainer}>
        Delay (ms)
        <Selector
          scale={1000}
          onChange={onDelayChange}
          options={delayTimeOptions}
          selected={currentDelay}
        />
      </div>
      <div className={styles.selectorContainer}>
        Reverb (s)
        <Selector
          scale={1}
          onChange={onReverbChange}
          options={reverbDecayOptions}
          selected={currentReverb}
        />
      </div>
    </div>
  );
};
