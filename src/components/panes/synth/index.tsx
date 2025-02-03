import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import {
  actionKeys,
  chromaticKeys,
  GAIN_MAX,
  waveforms,
  octaveOptions,
} from "./constants";
import { Waveform } from "./params/waveform/waveform";

import {
  type ActionDirection,
  type ActionKey,
  type EnvelopeParameter,
  type SynthSettings,
} from "@hideoutTypes/synth";

import styles from "./synth.module.scss";
import { EnvelopeParams } from "./params/envelope/envelope";
import { SpaceParams } from "./params/space";
import { FilterParams } from "./params/filter/filter";

/*
  To add:
    - secret key phrase played on the keyboard that will access a new page that you can't get to otherwise
      - May involve context values to redirect off the page unless the secret phrase has been guessed
    - Filter and UI for it
    - Fix styling with envelope and space params
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
      time: null,
      feedback: 0, // not working
    },
    reverb: settings.reverb ?? {
      decay: 0.5,
      mix: 0.5,
    },
    filter: settings.filter ?? {
      frequency: 20000,
      type: "lowpass",
      q: 1,
    },
  });

  const audioRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const delayRef = useRef<DelayNode | null>(null);
  const delayFeedbackRef = useRef<GainNode | null>(null);
  const convolverRef = useRef<ConvolverNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

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
        const decay = Math.exp(-i / (sampleRate * params.reverb.decay!)); // Adjust decay time here
        channelData[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    return impulse;
  };

  const onDelayChange = (time: number | null) => {
    setParams({
      ...params,
      delay: {
        ...params.delay,
        time,
      },
    });
  };

  const onReverbChange = (decay: number | null) => {
    setParams({
      ...params,
      reverb: {
        ...params.reverb,
        decay,
      },
    });
  };

  // I put this in here so changing the filter doesn't stop the sound
  useEffect(() => {
    if (audioRef.current !== null && filterRef.current !== null) {
      filterRef.current.frequency.value = params.filter.frequency;
      filterRef.current.type = params.filter.type;
      filterRef.current.Q.value = params.filter.q;

      gainNodeRef.current?.connect(filterRef.current);
      filterRef.current.connect(audioRef.current.destination);
    }
  }, [params.filter]);

  useEffect(() => {
    audioRef.current = new window.AudioContext();
    gainNodeRef.current = audioRef.current.createGain();
    oscRef.current = audioRef.current.createOscillator();
    delayRef.current = audioRef.current.createDelay();
    delayFeedbackRef.current = audioRef.current.createGain();
    convolverRef.current = audioRef.current.createConvolver();
    reverbGainRef.current = audioRef.current.createGain();
    filterRef.current = audioRef.current.createBiquadFilter();

    gainNodeRef.current.gain.value = 0;
    oscRef.current
      .connect(filterRef.current!)
      .connect(gainNodeRef.current)
      .connect(audioRef.current.destination);

    // I don't like the conditionals here. It makes the signal flow connections unclear
    if (params.delay.time !== null) {
      delayFeedbackRef.current.gain.value = params.delay.feedback;
      delayRef.current.delayTime.value = params.delay.time / 1000;

      gainNodeRef.current.connect(delayRef.current);
      delayRef.current.connect(delayFeedbackRef.current);
      delayFeedbackRef.current.connect(delayRef.current); // Create feedback loop
      delayRef.current.connect(audioRef.current.destination);
    }

    // I don't like the conditionals here. It makes the signal flow connections unclear
    if (params.reverb.decay !== null) {
      reverbGainRef.current.gain.value = params.reverb.mix;
      convolverRef.current.buffer = createImpulseResponse(audioRef.current);

      gainNodeRef.current.connect(convolverRef.current);
      convolverRef.current.connect(reverbGainRef.current);
      reverbGainRef.current.connect(audioRef.current.destination);
    }

    oscRef.current.type = params.waveform as OscillatorType;

    const keyupListener = (e: KeyboardEvent) => {
      if (pressedKey.current === e.code) {
        e.preventDefault();
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
          const freq = chromaticKey.baseFrequency * params.octave;
          handleChromaticKeyDown(freq, time);
        }
      } else if (actionKey) {
        e.preventDefault();
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
  }, [
    params.delay,
    params.envelope,
    params.gain,
    params.gain,
    params.octave,
    params.reverb,
    params.waveform,
  ]);

  return (
    <div className={styles.synthContainer}>
      <div className={styles.waveWindow}>
        <FilterParams
          filter={params.filter}
          onFilterChange={(frequency: number) => {
            setParams({ ...params, filter: { ...params.filter, frequency } });
          }}
        />
        {waveforms.map((current, i) => (
          <span key={i} className={classNames(styles.wavePane)}>
            <Waveform
              type={current}
              selected={waveforms.indexOf(params.waveform) === i}
            />
          </span>
        ))}
      </div>
      <div className={styles.paramsWindow}>
        <EnvelopeParams
          onEnvelopeChange={handleEnvelopeChange}
          envelope={params.envelope}
        />
        <SpaceParams
          currentDelay={params.delay.time}
          onDelayChange={onDelayChange}
          currentReverb={params.reverb.decay}
          onReverbChange={onReverbChange}
        />
      </div>
    </div>
  );
};
