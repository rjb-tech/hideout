import type { ReactNode } from "react";

import styles from "./window.module.scss";

interface IWindow {
  dynamicHeight?: boolean;
  children: ReactNode;
}

export const Window = ({ dynamicHeight, children }: IWindow) => {
  return (
    <div
      className={
        dynamicHeight
          ? styles.dynamicHeightWindowContainer
          : styles.windowContainer
      }
    >
      {children}
    </div>
  );
};
