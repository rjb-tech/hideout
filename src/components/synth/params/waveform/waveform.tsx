import type { ReactNode } from "react";
import type { HideoutWaveforms } from "@hideoutTypes/synth";

import styles from "./waveform.module.scss";

interface IWaveform {
  selected: boolean;
  type: HideoutWaveforms;
  onClick: (...args: any[]) => void;
}

export const Waveform = ({ selected, type, onClick }: IWaveform): ReactNode => {
  const pathMap: Record<HideoutWaveforms, string> = {
    sine: `M 10 50 
             C 20 50 26.67 20 36.67 20 
             C 46.67 20 53.33 80 63.33 80 
             C 73.33 80 80 20 90 20`,
    triangle: `M 10 50 L 30 20 L 50 80 L 70 20 L 90 50`,
    sawtooth: `M 10 50 L 36.67 20 L 36.67 80 L 63.33 20 L 63.33 80 L 90 20`,
    square: `M 10 80 L 10 20 L 50 20 L 50 80 L 90 80 L 90 20`,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={styles.waveform}
      onClick={onClick}
    >
      {selected && (
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      )}
      <path
        d={pathMap[type]}
        fill="none"
        className={styles.waveform}
        stroke="currentColor"
        strokeWidth="3"
        filter={selected ? "url(#glow)" : ""}
      />
    </svg>
  );
};
