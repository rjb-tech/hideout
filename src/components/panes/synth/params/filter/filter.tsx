import { Slider } from "@components/slider/slider";
import styles from "./filter.module.scss";
import type { SynthFilter } from "@hideoutTypes/synth";

interface IFilterParams {
  filter: SynthFilter;
  onFilterChange: (...args: any[]) => void;
}

export const FilterParams = ({ filter, onFilterChange }: IFilterParams) => {
  return (
    <div className={styles.filterParamsContainer}>
      <Slider
        min={45}
        max={20000}
        value={filter.frequency}
        onChange={(e: any) => onFilterChange(e.target.value)}
        sideText="Filter"
      />
    </div>
  );
};
