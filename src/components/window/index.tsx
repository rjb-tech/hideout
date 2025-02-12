import type { ReactNode } from "react";

import styles from "./window.module.scss";

interface IWindow {
  dynamicHeight?: boolean;
  children: ReactNode;
}

export const Window = ({ dynamicHeight, children }: IWindow) => {
  const year = new Date().getFullYear();
  return (
    <div
      className={
        dynamicHeight
          ? styles.dynamicHeightWindowContainer
          : styles.windowContainer
      }
    >
      {children}
      <p className={styles.copyright}>&copy; Ryne Burden {year}</p>
    </div>
  );
};
