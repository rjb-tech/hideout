import { SynthParams } from "./params";
import { SynthProcessor } from "./processor";

import styles from "./synth.module.scss";

/*
  To add:
    - secret key phrase played on the keyboard that will access a new page that you can't get to otherwise
    - Make delay feedback work
*/

export const SynthPane = () => {
  return (
    <div className={styles.container}>
      <strong>RJB-20</strong>
      <SynthParams />
      <SynthProcessor />
    </div>
  );
};
