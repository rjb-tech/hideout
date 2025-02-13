import styles from "./addOscillator.module.scss";

interface IAddOscillator {
  toggled: boolean;
  onClick: (...args: any[]) => void;
}

export const AddOscillator = ({ toggled, onClick }: IAddOscillator) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={styles.addOscillator}
      onClick={onClick}
    >
      {toggled && (
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      )}
      {/* Sine wave */}
      <path
        d="M8.33 50 C 20.83 50 20.83 25 33.33 25 C 45.83 25 45.83 75 58.33 75 C 70.83 75 70.83 50 83.33 50 C 87.5 50 91.67 50 91.67 50"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        className={styles.addOscillator}
        filter={toggled ? "url(#glow)" : ""}
      />
      {/* Plus symbol */}
      <path
        className={styles.addOscillator}
        d="M79.17 16.67 L79.17 33.33 M70.83 25 L87.5 25"
        stroke="currentColor"
        strokeWidth={3}
        filter={toggled ? "url(#glow)" : ""}
      />
    </svg>
  );
};
