import { useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";

import {
  actionKeys,
  chromaticKeys,
  GAIN_MAX,
  waveforms,
  octaveOptions,
} from "./constants";

import { type ActionDirection, type ActionKey } from "@hideoutTypes/synth";

import styles from "./synth.module.scss";
import { EnvelopeParams } from "./params/envelope/envelope";
import { SpaceParams } from "./params/space";
import { FilterParams } from "./params/filter";
import { SecondOscillator } from "./params/secondOscillator";
import { synthParamsStore } from "src/stores/synth";
import { WaveformParams } from "./params/waveform";

/*
  To add:
    - secret key phrase played on the keyboard that will access a new page that you can't get to otherwise
      - May involve context values to redirect off the page unless the secret phrase has been guessed
    - Fix all the styling
    - Make delay feedback work
    - Wire up filter so changing it doesn't stop the sound
    - wire envelope to filter
*/

const LOCAL_STORAGE_KEY = "synth_settings";

export const SynthPane = () => {
  // hook up a useEffect to pull synth settings if they exist
  const params = useStore(synthParamsStore);

  const audioRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc2gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
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

    synthParamsStore.setKey("waveform", waveforms[newIndex]);
  };

  const handleOctaveChangeAction = (direction: ActionDirection) => {
    const newOctave =
      direction === "incr" ? params.octave + 1 : params.octave - 1;

    if (octaveOptions.includes(newOctave)) {
      synthParamsStore.setKey("octave", newOctave);
    }
  };

  const handleChromaticKeyDown = (frequency: number, time: number) => {
    gainNodeRef.current!.gain.cancelScheduledValues(time);
    filterRef.current!.frequency.cancelScheduledValues(time);
    gainNodeRef.current!.gain.setValueAtTime(0, time);

    oscRef.current!.frequency.setValueAtTime(frequency * params.octave, time);
    osc2Ref.current!.frequency.setValueAtTime(frequency * params.octave, time);
    // if (params.filter.envelopeLink)
    //   filterRef.current!.frequency.setValueAtTime(
    //     params.filter.frequency,
    //     time,
    //   );

    const attackTime = time + params.envelope.attack / 100;
    const decayTime = attackTime + params.envelope.decay / 100;

    gainNodeRef.current!.gain.linearRampToValueAtTime(params.gain, attackTime);
    if (params.filter.envelopeLink) {
      // js is dumb, had to parse these as floats
      const maxFilterFrequency =
        parseFloat(`${params.filter.frequency}`) +
        parseFloat(`${params.filter.frequency}`) *
          (params.envelope.decay / 100);

      filterRef.current!.frequency.linearRampToValueAtTime(
        maxFilterFrequency,
        attackTime,
      );
    }
    // apply decay into sustain
    gainNodeRef.current!.gain.linearRampToValueAtTime(
      params.gain * (params.envelope.sustain / 100),
      decayTime,
    );

    if (params.filter.envelopeLink)
      filterRef.current!.frequency.linearRampToValueAtTime(
        params.filter.frequency * (params.envelope.sustain / 100),
        decayTime,
      );
  };

  const handleChromaticKeyUp = (time: number) => {
    gainNodeRef.current!.gain.cancelScheduledValues(time);
    filterRef.current!.frequency.cancelScheduledValues(time);

    gainNodeRef.current!.gain.linearRampToValueAtTime(
      0,
      time + params.envelope.release / 100,
    );

    if (params.filter.envelopeLink) {
      const filterEndFreq =
        parseFloat(`${params.filter.frequency}`) -
        parseFloat(`${params.filter.frequency}`) *
          (params.envelope.release / 100);

      filterRef.current!.frequency.linearRampToValueAtTime(
        filterEndFreq,
        time + params.envelope.release / 100,
      );
    }
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

  useEffect(() => {
    audioRef.current = new window.AudioContext();
    gainNodeRef.current = audioRef.current.createGain();
    osc2gainNodeRef.current = audioRef.current.createGain();
    oscRef.current = audioRef.current.createOscillator();
    osc2Ref.current = audioRef.current.createOscillator();
    delayRef.current = audioRef.current.createDelay();
    delayFeedbackRef.current = audioRef.current.createGain();
    convolverRef.current = audioRef.current.createConvolver();
    reverbGainRef.current = audioRef.current.createGain();
    filterRef.current = audioRef.current.createBiquadFilter();

    gainNodeRef.current.gain.value = 0;
    osc2gainNodeRef.current.gain.value = GAIN_MAX - 0.1;
    filterRef.current.frequency.value = params.filter.frequency;
    filterRef.current.type = params.filter.type;
    filterRef.current.Q.value = params.filter.q;

    oscRef.current.connect(filterRef.current!);
    osc2Ref.current.connect(osc2gainNodeRef.current);
    filterRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioRef.current.destination);

    if (params.secondOscOn) osc2gainNodeRef.current.connect(filterRef.current!);
    if (params.delay.time !== null) {
      // I don't like the conditionals here. It makes the signal flow connections unclear
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
    osc2Ref.current.type = "sawtooth";

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
        osc2Ref.current!.start();
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
        osc2Ref.current?.stop();
        audioRef.current?.close();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.delay,
    params.envelope,
    params.gain,
    params.octave,
    params.reverb,
    params.waveform,
    params.filter,
    params.secondOscOn,
  ]);

  return (
    <div className={styles.synthContainer}>
      <strong>RJB-20</strong>
      <div className={styles.top}>
        <FilterParams />
        <div className={styles.waveformSelector}>
          OSC1
          <WaveformParams />
        </div>
        <div className={styles.osc2}>
          OSC2
          <SecondOscillator />
        </div>
      </div>
      <div className={styles.bottom}>
        <EnvelopeParams />
        <SpaceParams />
      </div>
    </div>
  );
};
