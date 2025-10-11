import { useStore } from "@nanostores/react";
import { synthParamsStore } from "src/stores/synth";

import sharedStyles from "@styles/sharedStyles.module.scss";

export const EnvelopeLinkIcon = () => {
  const { filter } = useStore(synthParamsStore);

  const onLinkEnvelope = () =>
    synthParamsStore.setKey("filter", {
      ...filter,
      envelopeLink: !filter.envelopeLink,
    });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 100 100"
      strokeWidth="3"
      stroke="currentColor"
      className={
        filter.envelopeLink ? sharedStyles.svgLightGreen : sharedStyles.svgWhite
      }
      onClick={onLinkEnvelope}
    >
      {filter.envelopeLink && (
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
        d="
        M 54.96 36.12 
        a 18.75 18.75 0 0 1 5.17 30.18 
        l -18.75 18.75 
        a 18.75 18.75 0 0 1 -26.56 -26.56 
        l 7.32 -7.32
        m 55.56 -2.59 
        l 7.32 -7.32 
        a 18.75 18.75 0 0 0 -26.56 -26.56 
        l -18.75 18.75 
        a 18.75 18.75 0 0 0 5.17 30.18
      "
        filter={filter.envelopeLink ? "url(#glow)" : ""}
        className={
          filter.envelopeLink
            ? sharedStyles.svgLightGreen
            : sharedStyles.svgWhite
        }
      />
    </svg>
  );
};
