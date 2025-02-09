import styles from "./filter.module.scss";

interface IEnvelopeLinkIcon {
  selected: boolean;
  onClick: (...args: any[]) => void;
}

export const EnvelopeLinkIcon = ({ selected, onClick }: IEnvelopeLinkIcon) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 100 100"
      strokeWidth="5"
      stroke="currentColor"
      className={styles.envelopeLink}
      onClick={onClick}
    >
      {selected && (
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
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
        filter={selected ? "url(#glow)" : ""}
      />
    </svg>
  );
};
