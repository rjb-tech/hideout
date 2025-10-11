import { useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";

import {
  actionKeys,
  chromaticKeys,
  octaveOptions,
  waveforms,
} from "@constants/synth";
import { SYNTH_LOCAL_STORAGE_KEY, synthParamsStore } from "@stores/synth";
import {
  type SynthSettings,
  type ActionDirection,
  type ActionKey,
} from "@hideoutTypes/synth";
import { synthEngine } from "../engine";

export const SynthProcessor = () => {
  const params = useStore(synthParamsStore);
  const pressedKey = useRef<string | null>(null);
  const paramsRef = useRef<SynthSettings>(params);

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
    const currentIndex = waveforms.indexOf(paramsRef.current.waveform);
    const newIndex =
      direction === "incr"
        ? (currentIndex + 1) % waveforms.length
        : (currentIndex - 1 + waveforms.length) % waveforms.length;

    synthParamsStore.setKey("waveform", waveforms[newIndex]);
  };

  const handleOctaveChangeAction = (direction: ActionDirection) => {
    const newOctave =
      direction === "incr"
        ? paramsRef.current.octave + 1
        : paramsRef.current.octave - 1;

    if (octaveOptions.includes(newOctave)) {
      synthParamsStore.setKey("octave", newOctave);
    }
  };

  const keyupListener = (e: KeyboardEvent) => {
    if (pressedKey.current === e.code) {
      e.preventDefault();
      synthEngine.stopOscillator();
      pressedKey.current = null;
    }
  };

  const keydownListener = (e: KeyboardEvent) => {
    if (paramsRef.current.sequencer.playing) return;

    const chromaticKey = chromaticKeys[e.code];
    const actionKey = actionKeys[e.code];
    if (chromaticKey) {
      if (pressedKey.current !== e.code) {
        pressedKey.current = e.code;
        synthEngine.playOscillator(
          chromaticKey.baseFrequency * paramsRef.current.octave,
        );
        if (paramsRef.current.sequencer.recording) {
          synthEngine.recordNoteToSequencer(
            chromaticKey.baseFrequency * paramsRef.current.octave,
          );
        }
      }
    } else if (actionKey) {
      e.preventDefault();
      handleActionKeys(actionKey);
    }
  };

  useEffect(() => {
    synthEngine.init();

    window.addEventListener("keyup", keyupListener);
    window.addEventListener("keydown", keydownListener);

    return () => {
      synthEngine.cleanup();

      window.removeEventListener("keyup", keyupListener);
      window.removeEventListener("keydown", keydownListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(
      SYNTH_LOCAL_STORAGE_KEY,
      JSON.stringify(params),
    );

    paramsRef.current = params;
  }, [params]);

  return <></>;
};
