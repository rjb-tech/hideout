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
      <div className={styles.selectorContainer}>
        Delay
        <Selector
          onChange={onDelayChange}
          options={delayTimeOptions}
          selected={currentDelay}
        />
      </div>
      <div className={styles.selectorContainer}>
        Reverb
        <Selector
          onChange={onReverbChange}
          options={reverbDecayOptions}
          selected={currentReverb}
        />
      </div>
    </div>
  );
};
