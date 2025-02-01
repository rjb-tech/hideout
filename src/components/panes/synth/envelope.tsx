import classNames from "classnames";
import styles from "./envelope.module.scss";

export const Envelope = ({ onEnvelopeChange, envelope }: any) => {
  return (
    <div className={styles.envelopeContainer}>
      <div className={classNames(styles.slider, styles.attack)}>
        <label htmlFor="attack">A</label>
        <input
          min={1}
          max={200}
          type="range"
          name="attack"
          value={envelope.attack}
          onChange={onEnvelopeChange("attack")}
        />
      </div>
      <div className={classNames(styles.slider, styles.decay)}>
        <label htmlFor="decay">D</label>
        <input
          min={1}
          max={200}
          type="range"
          name="decay"
          value={envelope.decay}
          onChange={onEnvelopeChange("decay")}
        />
      </div>
      <div className={classNames(styles.slider, styles.sustain)}>
        <label htmlFor="sustain">S</label>
        <input
          min={0}
          max={100}
          type="range"
          name="sustain"
          value={envelope.sustain}
          onChange={onEnvelopeChange("sustain")}
        />
      </div>
      <div className={classNames(styles.slider, styles.release)}>
        <label htmlFor="release">R</label>
        <input
          min={1}
          max={200}
          type="range"
          name="release"
          value={envelope.release}
          onChange={onEnvelopeChange("release")}
        />
      </div>
    </div>
  );
};
