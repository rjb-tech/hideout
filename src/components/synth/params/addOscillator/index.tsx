import styles from "./addOscillator.module.scss";

interface IAddOscillator {
  toggled: boolean;
  onClick: (...args: any[]) => void;
}

export const AddOscillator = ({ toggled, onClick }: IAddOscillator) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={styles.addOscillator}
      onClick={onClick}
    >
      {toggled && (
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      )}
      {/* Sine wave */}
      <path
        d="M2 12 C 5 12 5 6 8 6 C 11 6 11 18 14 18 C 17 18 17 12 20 12 C 21 12 22 12 22 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        className={styles.addOscillator}
        filter={toggled ? "url(#glow)" : ""}
      />
      {/* Plus symbol */}
      <path
        className={styles.addOscillator}
        d="M19 4 L19 8 M17 6 L21 6"
        stroke="currentColor"
        strokeWidth={1}
        filter={toggled ? "url(#glow)" : ""}
      />
    </svg>
  );
};
