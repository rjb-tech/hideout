import { useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { synthParamsStore } from "@stores/synth";

import {
  actionKeys,
  chromaticKeys,
  octaveOptions,
  waveforms,
} from "@constants/synth";
import type { ActionDirection, ActionKey } from "@hideoutTypes/synth";
import { synthEngine } from "../engine";

export const SynthOscillator = () => {
  const params = useStore(synthParamsStore);

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

  const keyupListener = (e: KeyboardEvent) => {
    if (pressedKey.current === e.code) {
      e.preventDefault();
      synthEngine.stopOscillator();
      pressedKey.current = null;
    }
  };
  const keydownListener = (e: KeyboardEvent) => {
    const chromaticKey = chromaticKeys[e.code];
    const actionKey = actionKeys[e.code];
    if (chromaticKey) {
      if (pressedKey.current !== e.code) {
        pressedKey.current = e.code;
        const freq = chromaticKey.baseFrequency * params.octave; // can I move this to the synth engine?
        synthEngine.playOscillator(chromaticKey.baseFrequency);
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
      window.removeEventListener("keyup", keyupListener);
      window.removeEventListener("keydown", keydownListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
