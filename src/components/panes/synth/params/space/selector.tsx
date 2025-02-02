import classNames from "classnames";

import styles from "./space.module.scss";

interface ISelector {
  onChange: (time: number | null) => void;
  options: number[];
  selected: number | null;
}

export const Selector = ({ onChange, options, selected }: ISelector) => {
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
        return (
          <span
            key={i}
            onClick={() => onChange(option)}
            className={classNames(
              styles.node,
              `${isRightNode && styles.rightNode} ${isSelected && styles.selected}`,
            )}
          >
            {option}
          </span>
        );
      })}
    </div>
  );
};
