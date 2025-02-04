import type { ReactNode } from "react";
import styles from "./pane.module.scss";

interface IPane {
  fullWidth?: boolean;
  children: ReactNode;
}

/**
 * This is meant to be used inside a container that is the already sized to the correct height and full width.
 *
 * It contains styling with the correct background colors and such
 *
 * @param {ReactNode} children The contents to be rendered inside the pane
 * @param {boolean} fullWidth Makes the container 100% width rather than 50%
 */
export const Pane = ({ fullWidth, children }: IPane) => {
  return (
    <div className={fullWidth ? styles.fullWidthContainer : styles.container}>
      {children}
    </div>
  );
};
