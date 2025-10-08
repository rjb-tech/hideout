import { useStore } from "@nanostores/react";

import { Slider } from "@components/slider/slider";
import styles from "./filter.module.scss";
import { chromaticKeys } from "../../constants";
import { EnvelopeLinkIcon } from "./envelopeLink";
import { synthParamsStore } from "src/stores/synth";

export const FilterParams = () => {
  const { filter, octave } = useStore(synthParamsStore);
  const minFreq = chromaticKeys["KeyA"].baseFrequency * octave;

  const onFilterChange = (frequency: number) => {
    synthParamsStore.setKey("filter", { ...filter, frequency });
  };

  const onResonanceChange = (q: number) => {
    synthParamsStore.setKey("filter", { ...filter, q });
  };

  const onLinkEnvelope = () =>
    synthParamsStore.setKey("filter", {
      ...filter,
      envelopeLink: !filter.envelopeLink,
    });

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
            onChange={(e: any) => onFilterChange(e.target.value)}
            sideText="Frequency"
          />
          <Slider
            min={0}
            max={30}
            value={filter.q}
            onChange={(e: any) => onResonanceChange(e.target.value)}
            sideText="Resonance"
          />
        </div>
      </div>
    </div>
  );
};
