import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import {
  actionKeys,
  chromaticKeys,
  GAIN_MAX,
  waveforms,
  octaveOptions,
} from "./constants";
import { Waveform } from "./waveform";

import {
  type ActionDirection,
  type ActionKey,
  type EnvelopeParameter,
  type SynthSettings,
} from "@hideoutTypes/synth";

import styles from "./synth.module.scss";
import { Envelope } from "./envelope";

/*
  To add:
    - secret key phrase played on the keyboard that will access a new page that you can't get to otherwise
      - May involve context values to redirect off the page unless the secret phrase has been guessed
*/

const LOCAL_STORAGE_KEY = "synth_settings";

export const SynthPane = () => {
  const settings = JSON.parse(
    window.sessionStorage.getItem(LOCAL_STORAGE_KEY) ?? "{}",
  ) as SynthSettings;

  const [params, setParams] = useState<SynthSettings>({
    gain: settings.gain ?? GAIN_MAX,
    octave: settings.octave ?? 2,
    waveform: settings.waveform ?? "sawtooth",
    envelope: settings.envelope ?? {
      attack: 0,
      decay: 0,
      sustain: 100,
      release: 0,
    },
    delay: settings.delay ?? {
      on: true,
      time: 300,
      feedback: 0, // not working
    },
    reverb: settings.reverb ?? {
      on: true,
      mix: 0.5,
    },
  });

  const audioRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const delayRef = useRef<DelayNode | null>(null);
  const delayFeedbackRef = useRef<GainNode | null>(null);
  const convolverRef = useRef<ConvolverNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);

  const pressedKey = useRef<string | null>(null);

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
    const currentIndex = waveforms.indexOf(params.waveform);
    const newIndex =
      direction === "incr"
        ? (currentIndex + 1) % waveforms.length
        : (currentIndex - 1 + waveforms.length) % waveforms.length;

    setParams({ ...params, waveform: waveforms[newIndex] });
  };

  const handleOctaveChangeAction = (direction: ActionDirection) => {
    const newOctave =
      direction === "incr" ? params.octave + 1 : params.octave - 1;

    if (octaveOptions.includes(newOctave)) {
      setParams({ ...params, octave: newOctave });
    }
  };

  const handleEnvelopeChange =
    (parameter: EnvelopeParameter) => (event: any) => {
      setParams({
        ...params,
        envelope: {
          ...params.envelope,
          [parameter]: parseInt(event.target.value, 10),
        },
      });
    };

  const handleChromaticKeyDown = (frequency: number, time: number) => {
    oscRef.current!.frequency.setValueAtTime(frequency * params.octave, time);

    const attackTime = time + params.envelope.attack / 100;
    const decayTime = attackTime + params.envelope.decay / 100;

    gainNodeRef.current!.gain.cancelScheduledValues(time);
    // gainNodeRef.current!.gain.setValueAtTime(0, time);

    // apply attack
    gainNodeRef.current!.gain.linearRampToValueAtTime(params.gain, attackTime);

    // apply decay into sustain
    gainNodeRef.current!.gain.linearRampToValueAtTime(
      params.gain * (params.envelope.sustain / 100),
      decayTime,
    );
  };

  // short key presses still don't apply release correctly
  // might be something with not hitting attack?
  // probably should apply key up differently depending on envelope
  // second oscillator might be needed to make it clean
  const handleChromaticKeyUp = (time: number) => {
    gainNodeRef.current!.gain.cancelScheduledValues(time);
    gainNodeRef.current!.gain.linearRampToValueAtTime(
      0,
      time + params.envelope.release / 100,
    );
  };

  const createImpulseResponse = (audioContext: AudioContext) => {
    const sampleRate = audioContext.sampleRate;
    const length = 2 * sampleRate; // 2 seconds
    const impulse = audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Create a decaying noise for natural reverb sound
        const decay = Math.exp(-i / (sampleRate * 0.5)); // Adjust decay time here
        channelData[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    return impulse;
  };

  useEffect(() => {
    audioRef.current = new window.AudioContext();
    gainNodeRef.current = audioRef.current.createGain();
    oscRef.current = audioRef.current.createOscillator();
    delayRef.current = audioRef.current.createDelay();
    delayFeedbackRef.current = audioRef.current.createGain();
    convolverRef.current = audioRef.current.createConvolver();
    reverbGainRef.current = audioRef.current.createGain();

    delayRef.current.delayTime.value = params.delay.time / 1000;
    delayFeedbackRef.current.gain.value = params.delay.feedback;
    reverbGainRef.current.gain.value = params.reverb.mix;
    convolverRef.current.buffer = createImpulseResponse(audioRef.current);

    gainNodeRef.current.gain.value = 0;
    oscRef.current
      .connect(gainNodeRef.current)
      .connect(audioRef.current.destination);

    if (params.delay.on) {
      gainNodeRef.current.connect(delayRef.current);
      delayRef.current.connect(delayFeedbackRef.current);
      delayFeedbackRef.current.connect(delayRef.current); // Create feedback loop
      delayRef.current.connect(audioRef.current.destination);
    }

    if (params.reverb.on) {
      gainNodeRef.current.connect(convolverRef.current);
      convolverRef.current.connect(reverbGainRef.current);
      reverbGainRef.current.connect(audioRef.current.destination);
    }

    oscRef.current.type = params.waveform as OscillatorType;

    const keyupListener = (e: KeyboardEvent) => {
      e.preventDefault();

      if (pressedKey.current === e.code) {
        handleChromaticKeyUp(audioRef.current!.currentTime);
        pressedKey.current = null;
      }
    };
    const keydownListener = (e: KeyboardEvent) => {
      e.preventDefault();

      const chromaticKey = chromaticKeys[e.code];
      const actionKey = actionKeys[e.code];
      try {
        oscRef.current!.start();
      } catch {}
      if (chromaticKey) {
        if (pressedKey.current !== e.code) {
          pressedKey.current = e.code;
          const time = audioRef.current!.currentTime;
          const freq = chromaticKey.baseFrequency * params.octave;
          handleChromaticKeyDown(freq, time);
        }
      } else if (actionKey) {
        handleActionKeys(actionKey);
      }
    };

    window.sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(params));

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
  }, [params]);

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
      <Envelope
        onEnvelopeChange={handleEnvelopeChange}
        envelope={params.envelope}
      />
    </div>
  );
};
