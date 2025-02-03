import { Slider } from "@components/slider/slider";
import styles from "./filter.module.scss";
import type { SynthFilter } from "@hideoutTypes/synth";
import { chromaticKeys } from "../../constants";

interface IFilterParams {
  octave: number;
  filter: SynthFilter;
  onFilterChange: (...args: any[]) => void;
}

export const FilterParams = ({
  filter,
  onFilterChange,
  octave,
}: IFilterParams) => {
  const minFreq = chromaticKeys["KeyA"].baseFrequency * octave;

  return (
    <div className={styles.filterParamsContainer}>
      <Slider
        min={minFreq}
        max={20000}
        value={filter.frequency}
        onChange={(e: any) => onFilterChange(e.target.value)}
        sideText="Filter"
      />
    </div>
  );
};
