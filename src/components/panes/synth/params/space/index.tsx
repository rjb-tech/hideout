import styles from "./space.module.scss";

interface ISpaceParams {
  delayOn: boolean;
  onDelayChange: () => void;
  reverbOn: boolean;
  onReverbChange: () => void;
}

export const SpaceParams = ({
  delayOn,
  onDelayChange,
  reverbOn,
  onReverbChange,
}: ISpaceParams) => {
  return (
    <div className={styles.container}>
      <label className={styles.switch}>
        <input type="checkbox" checked={delayOn} onChange={onDelayChange} />
        <span className={styles.slider}></span>
      </label>
      <label className={styles.switch}>
        <input type="checkbox" checked={reverbOn} onChange={onReverbChange} />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
};
