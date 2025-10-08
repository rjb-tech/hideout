import styles from "./slider.module.scss";

interface ISlider {
  value: number;
  min: number;
  max: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sideText?: string;
}

export const Slider = ({ value, min, max, onChange, sideText }: ISlider) => {
  return (
    <label className={styles.slider}>
      <input
        type="range"
        className={styles.level}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
      {sideText}
    </label>
  );
};
