import type { EnvelopeParameter } from "@hideoutTypes/synth";
import { Slider } from "@components/slider/slider";

import styles from "./envelope.module.scss";
import { useStore } from "@nanostores/react";
import { synthParamsStore } from "src/stores/synth";

export const EnvelopeParams = () => {
  const { envelope } = useStore(synthParamsStore);

  const handleEnvelopeChange =
    (parameter: EnvelopeParameter) => (event: any) => {
      synthParamsStore.setKey("envelope", {
        ...envelope,
        [parameter]: parseInt(event.target.value, 10),
      });
    };

  return (
    <div className={styles.envelopeContainer}>
      <span className={styles.header}>ENVELOPE</span>
      <Slider
        min={1} // smooths the sound just a touch
        max={100}
        value={envelope.attack}
        onChange={handleEnvelopeChange("attack")}
        sideText="A"
      />
      <Slider
        min={0}
        max={100}
        value={envelope.decay}
        onChange={handleEnvelopeChange("decay")}
        sideText="D"
      />
      <Slider
        min={0}
        max={100}
        value={envelope.sustain}
        onChange={handleEnvelopeChange("sustain")}
        sideText="S"
      />
      <Slider
        min={0}
        max={100}
        value={envelope.release}
        onChange={handleEnvelopeChange("release")}
        sideText="R"
      />
    </div>
  );
};
