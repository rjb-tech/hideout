import { useStore } from "@nanostores/react";
import { synthParamsStore } from "@stores/synth";
import styles from "./lfo.module.scss";
export default function LfoEngaged() {
  const { lfo } = useStore(synthParamsStore);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 100 100"
      strokeWidth="4"
      stroke="currentColor"
      className={styles.engaged}
      onClick={() =>
        synthParamsStore.setKey("lfo", { ...lfo, engaged: !lfo.engaged })
      }
    >
      {lfo.engaged && (
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      )}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 50 10 v 40 M 27.5 27.5 A 30 30 0 1 0 72.5 27.5"
        filter={lfo.engaged ? "url(#glow)" : ""}
      />
    </svg>
  );
}
