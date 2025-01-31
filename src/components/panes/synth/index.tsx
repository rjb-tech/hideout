import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { actionKeys, chromaticKeys, GAIN_MAX, waveforms } from "./constants";
import { Waveform } from "./waveform";

import type {
  ActionDirection,
  ActionKey,
  HideoutWaveforms,
} from "@hideoutTypes/synth";

import styles from "./synth.module.scss";

/*
  To add:
    - secret key phrase played on the keyboard that will access a new page that you can't get to otherwise
      - May involve context values to redirect off the page unless the secret phrase has been guessed
    - add last used synth settings to session storage
*/

export const SynthPane = () => {
  const [gain, setGain] = useState<number>(GAIN_MAX);
  const [octave, setOctave] = useState<number>(2);
  const [waveType, setWaveType] = useState<HideoutWaveforms>("sine");

  const audioRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const octaveOptions = [1, 2, 3, 4];

  const handleActionKeys = (action: ActionKey) => {
    switch (action.scope) {
      case "wave":
        handleWaveChangeAction(action.direction);
        break;
      case "octave":
        handleOctaveChangeAction(action.direction);
        break;
    }
  };

  const handleWaveChangeAction = (direction: ActionDirection) => {
    const currentIndex = waveforms.indexOf(waveType);
    const newIndex =
      direction === "incr"
        ? (currentIndex + 1) % waveforms.length
        : (currentIndex - 1 + waveforms.length) % waveforms.length;

    setWaveType(waveforms[newIndex]);
  };

  const handleOctaveChangeAction = (direction: ActionDirection) => {
    const newOctave = direction === "incr" ? octave + 1 : octave - 1;

    if (octaveOptions.includes(newOctave)) {
      setOctave(newOctave);
    }
  };

  useEffect(() => {
    audioRef.current = new window.AudioContext();
    gainNodeRef.current = audioRef.current.createGain();
    oscRef.current = audioRef.current.createOscillator();

    gainNodeRef.current.gain.value = 0;
    oscRef.current
      .connect(gainNodeRef.current)
      .connect(audioRef.current.destination);

    oscRef.current.type = waveType as OscillatorType;

    const keyupListener = (e: KeyboardEvent) => {
      gainNodeRef.current!.gain.value = 0;
    };
    const keydownListener = (e: KeyboardEvent) => {
      const chromaticKey = chromaticKeys[e.code];
      const actionKey = actionKeys[e.code];
      try {
        oscRef.current!.start();
      } catch {}
      if (chromaticKey) {
        oscRef.current!.frequency.setValueAtTime(
          chromaticKeys[e.code]?.baseFrequency * octave,
          audioRef.current!.currentTime,
        );
        gainNodeRef.current!.gain.value = gain;
      } else if (actionKey) {
        handleActionKeys(actionKey);
      }
    };

    window.addEventListener("keyup", keyupListener);
    window.addEventListener("keydown", keydownListener);

    return () => {
      window.removeEventListener("keyup", keyupListener);
      window.removeEventListener("keydown", keydownListener);

      oscRef.current?.stop();
      audioRef.current?.close();
    };
  }, [octave, gain, waveType]);

  return (
    <div className={styles.synthContainer}>
      <div className={styles.waveWindow}>
        {waveforms.map((waveform, i) => (
          <span key={i} className={classNames(styles.wavePane)}>
            <Waveform
              type={waveform}
              className={styles.waveForm}
              selected={waveforms.indexOf(waveType) === i}
            />
          </span>
        ))}
      </div>
    </div>
  );
};
