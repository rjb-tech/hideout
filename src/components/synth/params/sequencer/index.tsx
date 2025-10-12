import { PlayPauseIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useStore } from "@nanostores/react";

import styles from "./sequencer.module.scss";
import sharedStyles from "@styles/sharedStyles.module.scss";
import type { SynthSettings } from "@hideoutTypes/synth";
import { synthParamsStore } from "@stores/synth";
import { BPM_MAX } from "@constants/synth";
import { synthEngine } from "../../engine";
import SequencerPlayPause from "./playPauseIcon";
import SequencerRecord from "./recordIcon";
import SequencerReset from "./resetIcon";

// make steps grey if they haven't been assigned a note

export const SynthSequencer = () => {
  const [keyPressed, setKeyPressed] = useState(false);
  const [resetSelected, setResetSelected] = useState(false);

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
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      synthEngine.playSequencerActiveStep();
      paramsRef.current.metronomeOn && synthEngine.playClick();
      interval = setInterval(
        () => {
          incrementActiveStep();
          synthEngine.playSequencerActiveStep();
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          paramsRef.current.metronomeOn && synthEngine.playClick();
        },
        1000 / (paramsRef.current.sequencer.bpm / 60),
      );
    } else {
      clearInterval(interval);
      synthEngine.stopOscillator();
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className={styles.icon}>
            <SequencerRecord />
          </div>
          <div className={styles.icon}>
            <SequencerPlayPause />
          </div>
          <div
            className={styles.icon}
            onMouseDown={() => setResetSelected(true)}
            onMouseUp={() => setResetSelected(false)}
          >
            <SequencerReset selected={resetSelected} />
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = parseInt(e.target.value, 10);
              if (value <= BPM_MAX) {
                synthParamsStore.setKey("sequencer", {
                  ...params.sequencer,
                  bpm: value,
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
