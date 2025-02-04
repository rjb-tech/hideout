import classNames from "classnames";

import styles from "./space.module.scss";

interface ISelector {
  onChange: (time: number | null) => void;
  options: number[];
  selected: number | null;
  scale: 1 | 1000; // s or ms
}

export const Selector = ({ onChange, options, selected, scale }: ISelector) => {
  return (
    <div className={styles.selector}>
      <span
        className={classNames(
          styles.node,
          styles.leftNode,
          `${selected === null && styles.selected}`,
        )}
        onClick={() => onChange(null)}
      >
        Off
      </span>
      {options.map((option, i) => {
        const isRightNode = i === options.length - 1;
        const isSelected = option === selected;
        const shouldPad = scale === 1 && option >= 1;

        return (
          <span
            key={i}
            onClick={() => onChange(option)}
            className={classNames(
              styles.node,
              `${isRightNode && styles.rightNode} ${isSelected && styles.selected}`,
            )}
          >
            {`${shouldPad ? option + ".0" : option}`}
          </span>
        );
      })}
    </div>
  );
};
