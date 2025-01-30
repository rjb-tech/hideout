import { SynthPane } from "@components/panes/synth";
import { Blog } from "@components/panes/blog";

import styles from "./homeWindow.module.scss";

export const HomeWindow = () => {
  return (
    <div className={styles.container}>
      <div className={styles.bioContainer}>
        <img src="/logo.png" />
        <span>Ryne Burden</span>
        <span>Software Engineer</span>
        <div>
          <a href="https://github.com/rjb-tech">Github</a>
        </div>
        <div>
          <a href="https://www.linkedin.com/in/ryne-burden-4210a0a3/">
            LinkedIn
          </a>
        </div>
      </div>
      <div className={styles.otherContainer}>
        <div className={styles.blogContainer}>
          <Blog />
        </div>
        <div className={styles.synthContainer}>
          <SynthPane />
        </div>
      </div>
    </div>
  );
};
