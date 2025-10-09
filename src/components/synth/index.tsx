import { useEffect } from "react";
import { useStore } from "@nanostores/react";

import { SynthParams } from "./params";
import { SynthProcessor } from "./processor";
import { SYNTH_LOCAL_STORAGE_KEY, synthParamsStore } from "@stores/synth";

import styles from "./synth.module.scss";

/*
  To add:
    - secret key phrase played on the keyboard that will access a new page that you can't get to otherwise
      - May involve context values to redirect off the page unless the secret phrase has been guessed
    - Fix all the styling
    - Make delay feedback work
    - Wire up filter so changing it doesn't stop the sound
    - wire envelope to filter
*/

export const SynthPane = () => {
  const params = useStore(synthParamsStore);

  useEffect(() => {
    window.sessionStorage.setItem(
      SYNTH_LOCAL_STORAGE_KEY,
      JSON.stringify(params),
    );
  }, [params]);

  return (
    <div className={styles.container}>
      <strong>RJB-20</strong>
      <SynthParams />
      <SynthProcessor />
    </div>
  );
};
