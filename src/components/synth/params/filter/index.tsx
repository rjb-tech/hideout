import { useStore } from "@nanostores/react";

import { Slider } from "@components/slider/slider";
import styles from "./filter.module.scss";
import { chromaticKeys } from "@constants/synth";
import { EnvelopeLinkIcon } from "./envelopeLink";
import { synthParamsStore } from "src/stores/synth";
import type { ChangeEvent } from "react";

export const FilterParams = () => {
  const { filter, octave } = useStore(synthParamsStore);
  const minFreq = chromaticKeys["KeyA"].baseFrequency * octave;

  const onFilterChange = (frequency: number) => {
    synthParamsStore.setKey("filter", { ...filter, frequency });
  };

  const onResonanceChange = (q: number) => {
    synthParamsStore.setKey("filter", { ...filter, q });
  };

  return (
    <div className={styles.filterContainer}>
      FILTER
      <div className={styles.filterParamsContainer}>
        <EnvelopeLinkIcon />
        <div className={styles.sliders}>
          <Slider
            min={minFreq}
            max={20000}
            value={filter.frequency}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onFilterChange(parseInt(e.target.value, 10))
            }
            sideText="Frequency"
          />
          <Slider
            min={0}
            max={30}
            value={filter.q}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onResonanceChange(parseInt(e.target.value, 10))
            }
            sideText="Resonance"
          />
        </div>
      </div>
    </div>
  );
};
