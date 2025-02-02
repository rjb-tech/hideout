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
  type SynthSettings,
} from "@hideoutTypes/synth";

import styles from "./synth.module.scss";
import { Envelope } from "./envelope";

/*
  To add:
    - secret key phrase played on the keyboard that will access a new page that you can't get to otherwise
      - May involve context values to redirect off the page unless the secret phrase has been guessed
    - add last used synth settings to session storage
*/

const LOCAL_STORAGE_KEY = "synth_settings";

export const SynthPane = () => {
  const settings = JSON.parse(
    window.sessionStorage.getItem(LOCAL_STORAGE_KEY) ?? "{}",
  ) as SynthSettings;
  const [gain, setGain] = useState<number>(settings?.gain ?? GAIN_MAX);
  const [octave, setOctave] = useState<number>(settings?.octave ?? 2);
  const [waveform, setWaveform] = useState<HideoutWaveforms>(
    settings?.waveform ?? "sine",
  );
  const [envelope, setEnvelope] = useState<EnvelopeValue>(
    settings?.envelope ?? {
      attack: 0,
      decay: 0,
      sustain: 100,
      release: 0,
    },
  );

  const audioRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const pressedKey = useRef<string | null>(null);

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
    const currentIndex = waveforms.indexOf(waveform);
    const newIndex =
      direction === "incr"
        ? (currentIndex + 1) % waveforms.length
        : (currentIndex - 1 + waveforms.length) % waveforms.length;

    setWaveform(waveforms[newIndex]);
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

  const handleChromaticKeyDown = (frequency: number, time: number) => {
    oscRef.current!.frequency.setValueAtTime(frequency * octave, time);

    const attackTime = time + envelope.attack / 100;
    const decayTime = attackTime + envelope.decay / 100;

    gainNodeRef.current!.gain.cancelScheduledValues(time);
    // gainNodeRef.current!.gain.setValueAtTime(0, time);

    // apply attack
    gainNodeRef.current!.gain.linearRampToValueAtTime(gain, attackTime);

    // apply decay into sustain
    gainNodeRef.current!.gain.linearRampToValueAtTime(
      gain * (envelope.sustain / 100),
      decayTime,
    );
  };

  // short key presses still don't apply release correctly
  // might be something with not hitting attack?
  // no sustain bit of attack, decay, and release causing sound retriggers on keyup
  // probably should apply key up differently depending on envelope
  // second oscillator might be needed to make it clean
  const handleChromaticKeyUp = (time: number) => {
    gainNodeRef.current!.gain.cancelScheduledValues(time);
    gainNodeRef.current!.gain.linearRampToValueAtTime(
      0,
      time + envelope.release / 100,
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

    oscRef.current.type = waveform as OscillatorType;

    const keyupListener = (e: KeyboardEvent) => {
      if (pressedKey.current === e.code) {
        handleChromaticKeyUp(audioRef.current!.currentTime);
        pressedKey.current = null;
      }
    };
    const keydownListener = (e: KeyboardEvent) => {
      const chromaticKey = chromaticKeys[e.code];
      const actionKey = actionKeys[e.code];
      try {
        oscRef.current!.start();
      } catch {}
      if (chromaticKey) {
        if (pressedKey.current !== e.code) {
          pressedKey.current = e.code;
          const time = audioRef.current!.currentTime;
          const freq = chromaticKey.baseFrequency * octave;
          handleChromaticKeyDown(freq, time);
        }
      } else if (actionKey) {
        handleActionKeys(actionKey);
      }
    };

    window.sessionStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        envelope,
        gain,
        waveform,
        octave,
      } as SynthSettings),
    );

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
  }, [octave, gain, waveform, envelope]);

  return (
    <div className={styles.synthContainer}>
      <div className={styles.waveWindow}>
        {waveforms.map((waveform, i) => (
          <span key={i} className={classNames(styles.wavePane)}>
            <Waveform
              type={waveform}
              className={styles.waveForm}
              selected={waveforms.indexOf(waveform) === i}
            />
          </span>
        ))}
      </div>
      <Envelope onEnvelopeChange={handleEnvelopeChange} envelope={envelope} />
    </div>
  );
};
