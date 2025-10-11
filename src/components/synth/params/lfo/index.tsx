import { Slider } from "@components/slider/slider";
import { useStore } from "@nanostores/react";
import { synthParamsStore } from "@stores/synth";
import { BPM_MAX } from "@constants/synth";

import styles from "./LFO.module.scss";
import LfoEngaged from "./engaged";

export const SynthLfo = () => {
  const { lfo } = useStore(synthParamsStore);

  return (
    <div className={styles.container}>
      LFO
      <div className={styles.controls}>
        <LfoEngaged />
        <div className={styles.sliders}>
          <Slider
            value={lfo.depth}
            min={1}
            max={100}
            sideText="Depth"
            onChange={(e) =>
              synthParamsStore.setKey("lfo", {
                ...lfo,
                depth: parseInt(e.target.value),
              })
            }
          />
          <Slider
            value={lfo.speed}
            min={1}
            max={BPM_MAX}
            sideText="Speed"
            disabled={lfo.bpmLink}
            onChange={(e) =>
              synthParamsStore.setKey("lfo", {
                ...lfo,
                speed: parseInt(e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
