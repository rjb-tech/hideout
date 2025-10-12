import { useStore } from "@nanostores/react";
import { synthParamsStore } from "@stores/synth";

import sharedStyles from "@styles/sharedStyles.module.scss";

interface ISequencerReset {
  selected: boolean;
}

export default function SequencerReset({ selected }: ISequencerReset) {
  const { sequencer } = useStore(synthParamsStore);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 100 100"
      strokeWidth="3"
      stroke="currentColor"
      className={selected ? sharedStyles.svgLightGreen : sharedStyles.svgWhite}
      onClick={() =>
        synthParamsStore.setKey("sequencer", {
          ...sequencer,
          activeStep: 0,
          playing: false,
          recording: false,
          notes: Array.from({ length: sequencer.numSteps }),
        })
      }
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 30 35 L 35 75 L 65 75 L 70 35 M 25 35 L 75 35 M 40 35 L 40 25 L 60 25 L 60 35"
        className={
          selected ? sharedStyles.svgLightGreen : sharedStyles.svgWhite
        }
      />
    </svg>
  );
}
