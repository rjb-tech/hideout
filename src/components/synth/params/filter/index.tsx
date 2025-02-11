import { Slider } from "@components/slider/slider";
import styles from "./filter.module.scss";
import type { SynthFilter } from "@hideoutTypes/synth";
import { chromaticKeys } from "../../constants";
import { EnvelopeLinkIcon } from "./envelopeLink";

interface IFilterParams {
  octave: number;
  filter: SynthFilter;
  filterLinked: boolean;
  onFilterChange: (...args: any[]) => void;
  onLinkClick: (...args: any[]) => void;
  onResChange: (...args: any[]) => void;
}

export const FilterParams = ({
  filter,
  onFilterChange,
  octave,
  filterLinked,
  onLinkClick,
  onResChange,
}: IFilterParams) => {
  const minFreq = chromaticKeys["KeyA"].baseFrequency * octave;

  return (
    <div className={styles.filterParamsContainer}>
      <EnvelopeLinkIcon selected={filterLinked} onClick={onLinkClick} />
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
          onChange={(e: any) => onResChange(e.target.value)}
          sideText="Resonance"
        />
      </div>
    </div>
  );
};
