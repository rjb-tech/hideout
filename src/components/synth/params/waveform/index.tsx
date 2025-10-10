import classNames from "classnames";

import styles from "./waveform.module.scss";
import { Waveform } from "./waveform";
import { waveforms } from "@constants/synth";

export const WaveformParams = () => {
  return (
    <div className={styles.waveforms}>
      {waveforms.map((current, i) => (
        <span key={i} className={classNames(styles.wavePane)}>
          <Waveform type={current} />
        </span>
      ))}
    </div>
  );
};
