import { useStore } from "@nanostores/react";

import styles from "./space.module.scss";
import { synthParamsStore } from "src/stores/synth";
import { delayTimeOptions, reverbDecayOptions } from "../../constants";
import { Selector } from "./selector";

export const SpaceParams = () => {
  const { delay, reverb } = useStore(synthParamsStore);

  const onDelayChange = (time: number | null) => {
    synthParamsStore.setKey("delay", { ...delay, time });
  };

  const onReverbChange = (decay: number | null) => {
    synthParamsStore.setKey("reverb", {
      ...reverb,
      decay,
    });
  };

  return (
    <div className={styles.container}>
      SPACE
      <div className={styles.selectorContainer}>
        Delay (ms)
        <Selector
          scale={1000}
          onChange={onDelayChange}
          options={delayTimeOptions}
          selected={delay.time}
        />
      </div>
      <div className={styles.selectorContainer}>
        Reverb (s)
        <Selector
          scale={1}
          onChange={onReverbChange}
          options={reverbDecayOptions}
          selected={reverb.decay}
        />
      </div>
    </div>
  );
};
