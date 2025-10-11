import { useStore } from "@nanostores/react";
import { synthParamsStore } from "@stores/synth";

import sharedStyles from "@styles/sharedStyles.module.scss";

export default function SequencerRecord() {
  const { sequencer } = useStore(synthParamsStore);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 100 100"
      stroke="currentColor"
      className={
        sequencer.recording ? sharedStyles.svgRed : sharedStyles.svgWhite
      }
      onClick={() =>
        synthParamsStore.setKey("sequencer", {
          ...sequencer,
          recording: !sequencer.recording,
        })
      }
    >
      {sequencer.recording && (
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      <circle
        cx="50"
        cy="50"
        r="20"
        filter={sequencer.recording ? "url(#glowRed)" : ""}
        className={
          sequencer.recording ? sharedStyles.svgRed : sharedStyles.svgWhite
        }
      />
    </svg>
  );
}
