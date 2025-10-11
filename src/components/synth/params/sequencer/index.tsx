import { PlayPauseIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";

import styles from "./sequencer.module.scss";
import sharedStyles from "@styles/sharedStyles.module.scss";
import type { SynthSettings } from "@hideoutTypes/synth";
import { synthParamsStore } from "@stores/synth";
import { BPM_MAX } from "@constants/synth";
import { synthEngine } from "../../engine";

export const SynthSequencer = () => {
  const [keyPressed, setKeyPressed] = useState(false);

  const params = useStore(synthParamsStore);
  const paramsRef = useRef<SynthSettings>(params);

  const setActiveStep = (activeStep: number) => {
    synthParamsStore.setKey("sequencer", {
      ...paramsRef.current.sequencer,
      activeStep,
    });
  };

  const setRecording = (recording: boolean) => {
    synthParamsStore.setKey("sequencer", {
      ...paramsRef.current.sequencer,
      recording,
    });
  };

  const incrementActiveStep = () => {
    // the ref is used here to avoid closure issues with the interval
    const { activeStep, numSteps } = paramsRef.current.sequencer;
    setActiveStep((activeStep + 1) % numSteps);
  };

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    let interval: number | undefined;
    if (paramsRef.current.sequencer.playing) {
      paramsRef.current.metronomeOn && synthEngine.playClick();
      incrementActiveStep();
      interval = setInterval(
        () => {
          paramsRef.current.metronomeOn && synthEngine.playClick();
          incrementActiveStep();
        },
        1000 / (paramsRef.current.sequencer.bpm / 60),
      );
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [params.sequencer.playing]);

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (e.code === "Space" && !keyPressed) {
        setKeyPressed(true);
        synthParamsStore.setKey("sequencer", {
          ...paramsRef.current.sequencer,
          playing: !paramsRef.current.sequencer.playing,
          recording: paramsRef.current.sequencer.recording
            ? !paramsRef.current.sequencer.recording
            : paramsRef.current.sequencer.recording,
        });
      }
    };

    const keyUpListener = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", keyDownListener);
    window.addEventListener("keyup", keyUpListener);

    return () => {
      window.removeEventListener("keydown", keyDownListener);
      window.removeEventListener("keyup", keyUpListener);
    };
  }, []);

  return (
    <div className={styles.container}>
      SEQUENCER
      <div className={styles.steps}>
        {Array.from({ length: params.sequencer.numSteps }).map((_, idx) => (
          <span
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`${styles.step} ${idx === params.sequencer.activeStep && styles.active}`}
          />
        ))}
      </div>
      <div className={styles.controlPanel}>
        <div className={styles.buttonPanel}>
          <div
            className={`${styles.button} ${params.sequencer.recording && sharedStyles.selected}`}
            onClick={() => setRecording(!params.sequencer.recording)}
          >
            <PlusCircleIcon fontSize={1} />
          </div>
          <div
            className={`${styles.button} ${params.sequencer.playing && sharedStyles.selected}`}
            onClick={() =>
              synthParamsStore.setKey("sequencer", {
                ...params.sequencer,
                playing: !params.sequencer.playing,
              })
            }
          >
            <PlayPauseIcon fontSize={1} />
          </div>
        </div>
        <div className={styles.bpm}>
          <label className={styles.bpmLabel} htmlFor="bpm">
            BPM
          </label>
          <input
            name="bpm"
            id="bpm"
            type="text"
            value={params.sequencer.bpm}
            onChange={(e: any) => {
              if ((e.target.value as number) <= BPM_MAX) {
                synthParamsStore.setKey("sequencer", {
                  ...params.sequencer,
                  bpm: e.target.value,
                });
              }
            }}
            className={styles.bpmInput}
          />
        </div>
      </div>
    </div>
  );
};
