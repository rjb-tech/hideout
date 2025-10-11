import classNames from "classnames";

import styles from "./waveform.module.scss";
import { waveforms } from "@constants/synth";
import { WaveformIcon } from "./icon";

export const WaveformParams = () => {
  return (
    <div className={styles.waveforms}>
      {waveforms.map((current, i) => (
        <span key={i} className={classNames(styles.wavePane)}>
          <WaveformIcon type={current} />
        </span>
      ))}
    </div>
  );
};
