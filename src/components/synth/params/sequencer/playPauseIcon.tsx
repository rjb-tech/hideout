import { useStore } from "@nanostores/react";
import { synthParamsStore } from "@stores/synth";

import sharedStyles from "@styles/sharedStyles.module.scss";

export default function SequencerPlayPause() {
  const { sequencer } = useStore(synthParamsStore);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 100 100"
      strokeWidth="3"
      stroke="currentColor"
      className={
        sequencer.playing ? sharedStyles.svgLightGreen : sharedStyles.svgWhite
      }
      onClick={() =>
        synthParamsStore.setKey("sequencer", {
          ...sequencer,
          playing: !sequencer.playing,
          recording: false,
        })
      }
    >
      {sequencer.playing && (
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 25 30 L 25 70 L 50 50 Z M 60 30 v 40 M 75 30 v 40"
        filter={sequencer.playing ? "url(#glow)" : ""}
        className={
          sequencer.playing ? sharedStyles.svgLightGreen : sharedStyles.svgWhite
        }
      />
    </svg>
  );
}
