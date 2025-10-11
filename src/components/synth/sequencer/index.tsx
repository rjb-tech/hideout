import {
  ClockIcon,
  PlayPauseIcon,
  PlusCircleIcon,
} from "@heroicons/react/16/solid";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

import styles from "./sequencer.module.scss";
import sharedStyles from "@styles/sharedStyles.module.scss";
import type { SynthSequencerParams } from "@hideoutTypes/synth";
import { maxBpm } from "../constants";

interface ISynthSequencer {
  params: SynthSequencerParams;
  numSteps: number;
  handleParamChange: (newParams: SynthSequencerParams) => void;
}

export const SynthSequencer = ({
  params,
  numSteps,
  handleParamChange,
}: ISynthSequencer) => {
  const [keyPressed, setKeyPressed] = useState(false);
  const [metronomeOn, setMetronomeOn] = useState(false);

  const metronomeOnRef = useRef<boolean>(metronomeOn);
  const paramsRef = useRef<SynthSequencerParams>(params);

  const setActiveStep = (activeStep: number) => {
    handleParamChange({ ...params, activeStep });
  };

  const setPlaying = (playing: boolean) => {
    handleParamChange({ ...params, playing });
  };

  const setRecording = (recording: boolean) => {
    handleParamChange({ ...params, recording });
  };

  useEffect(() => {
    metronomeOnRef.current = metronomeOn;
  }, [metronomeOn]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    var click = new Audio("/public/click.mp3");
    let interval = undefined;
    if (paramsRef.current.playing) {
      click.currentTime = 0;
      click.muted = !metronomeOnRef.current;
      click.play();
      interval = setInterval(
        () => {
          click.currentTime = 0;
          click.muted = !metronomeOnRef.current;
          click.play();
          setActiveStep(
            paramsRef.current.activeStep + 1 > numSteps - 1
              ? 0
              : paramsRef.current.activeStep + 1,
          );
        },
        1000 / (params.bpm / 60),
      );
    }

    return () => clearInterval(interval);
  }, [params.playing]);

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (e.code === "Space" && !keyPressed) {
        setKeyPressed(true);
        setPlaying(!paramsRef.current.playing);
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
        {Array.from({ length: numSteps }).map((_, idx) => (
          <span
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`${styles.step} ${idx === params.activeStep && styles.active}`}
          />
        ))}
      </div>
      <div className={styles.controlPanel}>
        <div className={styles.buttonPanel}>
          <div
            className={`${styles.button} ${params.recording && sharedStyles.selected}`}
            onClick={() => setRecording(!params.recording)}
          >
            <PlusCircleIcon fontSize={1} />
          </div>
          <div
            className={`${styles.button} ${params.playing && sharedStyles.selected}`}
            onClick={() => setPlaying(!params.playing)}
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
            value={params.bpm}
            onChange={(e: any) => {
              if ((e.target.value as number) <= maxBpm) {
                handleParamChange({ ...params, bpm: e.target.value });
              }
            }}
            className={styles.bpmInput}
          />
        </div>
        {/* <div
          className={`${styles.button} ${metronomeOn && sharedStyles.selected}`}
          onClick={() => setMetronomeOn((val) => !val)}
        >
          <ClockIcon fontSize={1} />
        </div> */}
      </div>
    </div>
  );
};
