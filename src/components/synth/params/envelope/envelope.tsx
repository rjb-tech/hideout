import type { EnvelopeValue } from "@hideoutTypes/synth";
import { Slider } from "@components/slider/slider";

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
      <span className={styles.header}>ENVELOPE</span>
      <Slider
        min={1} // smooths the sound just a touch
        max={100}
        value={envelope.attack}
        onChange={onEnvelopeChange("attack")}
        sideText="A"
      />
      <Slider
        min={0}
        max={100}
        value={envelope.decay}
        onChange={onEnvelopeChange("decay")}
        sideText="D"
      />
      <Slider
        min={0}
        max={100}
        value={envelope.sustain}
        onChange={onEnvelopeChange("sustain")}
        sideText="S"
      />
      <Slider
        min={0}
        max={100}
        value={envelope.release}
        onChange={onEnvelopeChange("release")}
        sideText="R"
      />
    </div>
  );
};
