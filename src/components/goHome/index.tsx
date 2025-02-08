import { HomeIcon } from "@heroicons/react/16/solid";

import styles from "./goHome.module.scss";

export const GoHome = () => (
  <a className={styles.link} href="/" target="_self">
    <div className={styles.goHome}>Home</div>
  </a>
);
