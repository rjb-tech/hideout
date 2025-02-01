import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { actionKeys, chromaticKeys, GAIN_MAX, waveforms } from "./constants";
import { Waveform } from "./waveform";

import {
  type EnvelopeValue,
  type ActionDirection,
  type ActionKey,
  type EnvelopeParameter,
  type HideoutWaveforms,
} from "@hideoutTypes/synth";

import styles from "./synth.module.scss";
import { Envelope } from "./envelope";

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
  const [envelope, setEnvelope] = useState<EnvelopeValue>({
    attack: 0,
    decay: 0,
    sustain: 0,
    release: 0,
  });

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

  const handleEnvelopeChange =
    (parameter: EnvelopeParameter) => (event: any) => {
      setEnvelope({
        ...envelope,
        [parameter]: parseInt(event.target.value, 10),
      });
    };

  const handleChromaticKey = (frequency: number, time: number) => {
    oscRef.current!.frequency.setValueAtTime(frequency * octave, time);

    gainNodeRef.current!.gain.setValueAtTime(0, time);
    gainNodeRef.current!.gain.linearRampToValueAtTime(
      gain,
      time + envelope.attack / 100,
    );
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
      gainNodeRef.current!.gain.setValueAtTime(
        0,
        audioRef.current!.currentTime,
      );
    };
    const keydownListener = (e: KeyboardEvent) => {
      const chromaticKey = chromaticKeys[e.code];
      const actionKey = actionKeys[e.code];
      try {
        oscRef.current!.start();
      } catch {}
      if (chromaticKey) {
        const time = audioRef.current!.currentTime;
        const freq = chromaticKey.baseFrequency * octave;
        handleChromaticKey(freq, time);
      } else if (actionKey) {
        handleActionKeys(actionKey);
      }
    };

    window.addEventListener("keyup", keyupListener);
    window.addEventListener("keydown", keydownListener);

    return () => {
      window.removeEventListener("keyup", keyupListener);
      window.removeEventListener("keydown", keydownListener);

      try {
        oscRef.current?.stop();
        audioRef.current?.close();
      } catch {}
    };
  }, [octave, gain, waveType, envelope]);

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
      <Envelope onEnvelopeChange={handleEnvelopeChange} envelope={envelope} />
    </div>
  );
};
