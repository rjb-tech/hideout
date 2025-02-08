import { Slider } from "@components/slider/slider";
import styles from "./filter.module.scss";
import type { SynthFilter } from "@hideoutTypes/synth";
import { chromaticKeys } from "../../constants";
import { LinkIcon } from "@heroicons/react/16/solid";

interface IFilterParams {
  octave: number;
  filter: SynthFilter;
  onFilterChange: (...args: any[]) => void;
  onLinkClick: (...args: any[]) => void;
}

export const FilterParams = ({
  filter,
  onFilterChange,
  octave,
  onLinkClick,
}: IFilterParams) => {
  const minFreq = chromaticKeys["KeyA"].baseFrequency * octave;

  return (
    <div className={styles.filterParamsContainer}>
      <LinkIcon onClick={onLinkClick} className={styles.envelopeLink} />
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
