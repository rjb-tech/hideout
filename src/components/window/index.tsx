import type { ReactNode } from "react";

import styles from "./window.module.scss";

interface IWindow {
  children: ReactNode;
}

export const Window = ({ children }: IWindow) => {
  return <div className={styles.windowContainer}>{children}</div>;
};
