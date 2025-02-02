import type { EnvelopeValue } from "@hideoutTypes/synth";
import styles from "./envelope.module.scss";

interface IEnvelopeParams {
  onEnvelopeChange: any;
  envelope: EnvelopeValue;
}

export const EnvelopeParams = ({
  onEnvelopeChange,
  envelope,
}: IEnvelopeParams) => {
  return (
    <div className={styles.envelopeContainer}>
      <label className={styles.slider}>
        <input
          name="attack"
          type="range"
          className={styles.level}
          min={0}
          max={100}
          value={envelope.attack}
          onChange={onEnvelopeChange("attack")}
        />
        A
      </label>
      <label className={styles.slider}>
        <input
          name="decay"
          type="range"
          className={styles.level}
          min={0}
          max={100}
          value={envelope.decay}
          onChange={onEnvelopeChange("decay")}
        />
        D
      </label>
      <label className={styles.slider}>
        <input
          name="sustain"
          type="range"
          className={styles.level}
          min={0}
          max={100}
          value={envelope.sustain}
          onChange={onEnvelopeChange("sustain")}
        />
        S
      </label>
      <label className={styles.slider}>
        <input
          name="release"
          type="range"
          className={styles.level}
          min={0}
          max={200}
          value={envelope.release}
          onChange={onEnvelopeChange("release")}
        />
        R
      </label>
    </div>
  );
};
