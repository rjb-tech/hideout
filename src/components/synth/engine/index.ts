import { GAIN_MAX } from "@constants/synth";
import type {
  HideoutWaveforms,
  SynthDelay,
  SynthFilter,
  SynthReverb,
} from "@hideoutTypes/synth";
import { synthParamsStore } from "@stores/synth";

class SynthEngine {
  /* ----- Class Members ----- */
  private audio = new AudioContext();

  // gain nodes
  private oscillatorGain = this.audio.createGain();
  private oscillator2Gain = this.audio.createGain();
  private delayGain = this.audio.createGain();
  private reverbGain = this.audio.createGain();
  private mainGain = this.audio.createGain();

  // oscillators
  private oscillator = this.audio.createOscillator();
  private oscillator2 = this.audio.createOscillator();

  // space
  private delay = this.audio.createDelay();
  private reverb = this.audio.createConvolver();

  // filter
  private filter = this.audio.createBiquadFilter();

  // synth params
  private params = synthParamsStore.get();

  /* ----- Methods ----- */
  public constructor() {
    synthParamsStore.subscribe((value, oldValue, key) => {
      this.params = value;
      switch (key) {
        case "reverb":
          this.updateReverb(value.reverb);
          break;
        case "delay":
          this.updateDelay(value.delay);
          break;
        case "filter":
          this.updateFilter(value.filter);
          break;
        case "waveform":
          this.updateOscillatorWaveform(value.waveform);
          break;
        case "secondOscOn":
          this.toggleSecondOscillator();
          break;
      }
    });
  }

  public init() {
    this.oscillator.connect(this.oscillatorGain);
    this.oscillator2.connect(this.oscillator2Gain);
    this.oscillatorGain.connect(this.filter);
    this.oscillator2Gain.connect(this.filter);

    this.filter.connect(this.mainGain);

    this.mainGain.connect(this.delay);
    this.mainGain.connect(this.reverb);

    this.reverb.connect(this.reverbGain);
    this.delay.connect(this.delayGain);

    this.mainGain.connect(this.audio.destination);
    this.delayGain.connect(this.audio.destination);
    this.reverbGain.connect(this.audio.destination);

    this.oscillatorGain.gain.value = GAIN_MAX;
    this.oscillator2Gain.gain.value = GAIN_MAX;
    this.delayGain.gain.value = GAIN_MAX; // need a mix value
    this.reverbGain.gain.value = this.params.reverb.mix;
  }

  public cleanup() {
    this.oscillator.stop();
    this.oscillator2.stop();
    this.audio.close();
  }

  public playOscillator(frequency: number): void {
    try {
      this.oscillator.start();
      this.oscillator2.start();
    } catch {}

    this.mainGain.gain.cancelScheduledValues(this.audio.currentTime);
    this.filter.frequency.cancelScheduledValues(this.audio.currentTime);
    this.mainGain.gain.setValueAtTime(0, this.audio.currentTime);

    this.oscillator.frequency.setValueAtTime(
      frequency * this.params.octave,
      this.audio.currentTime,
    );
    this.oscillator2.frequency.setValueAtTime(
      frequency * this.params.octave,
      this.audio.currentTime,
    ); // detune setting??

    const attackTime =
      this.audio.currentTime + this.params.envelope.attack / 100;
    const decayTime = attackTime + this.params.envelope.decay / 100;

    this.mainGain.gain.linearRampToValueAtTime(this.params.gain, attackTime);
    if (this.params.filter.envelopeLink) {
      const maxFilterFrequency =
        parseFloat(`${this.params.filter.frequency}`) +
        parseFloat(`${this.params.filter.frequency}`) *
          (this.params.envelope.decay / 100);

      this.filter.frequency.linearRampToValueAtTime(
        maxFilterFrequency,
        attackTime,
      );
    }
    // apply decay into sustain
    this.mainGain.gain.linearRampToValueAtTime(
      this.params.gain * (this.params.envelope.sustain / 100),
      decayTime,
    );

    if (this.params.filter.envelopeLink)
      this.filter.frequency.linearRampToValueAtTime(
        this.params.filter.frequency * (this.params.envelope.sustain / 100),
        decayTime,
      );
  }

  public stopOscillator(): void {
    this.mainGain.gain.cancelScheduledValues(this.audio.currentTime);
    this.filter.frequency.cancelScheduledValues(this.audio.currentTime);

    this.mainGain.gain.linearRampToValueAtTime(
      0,
      this.audio.currentTime + this.params.envelope.release / 100,
    );

    if (this.params.filter.envelopeLink) {
      const filterEndFreq =
        parseFloat(`${this.params.filter.frequency}`) -
        parseFloat(`${this.params.filter.frequency}`) *
          (this.params.envelope.release / 100);

      this.filter.frequency.linearRampToValueAtTime(
        filterEndFreq,
        this.audio.currentTime + this.params.envelope.release / 100,
      );
    }
  }

  private updateFilter(update: SynthFilter) {
    this.filter.frequency.value = update.frequency;
    this.filter.type = update.type;
    this.filter.Q.value = update.q;
  }

  private updateDelay(update: SynthDelay) {
    if (!!update.time) {
      this.delayGain.gain.value = GAIN_MAX;
      this.delay.delayTime.value = update.time / 1000;
    } else {
      this.delayGain.gain.value = 0;
    }
  }

  private updateReverb(update: SynthReverb) {
    console.log(update);
    if (update.decay !== null) {
      this.reverbGain.gain.value = GAIN_MAX;
      this.reverb.buffer = this.createImpulseResponse(update.decay);
    } else {
      this.reverbGain.gain.value = 0;
    }
  }

  private updateOscillatorWaveform(update: HideoutWaveforms) {
    this.oscillator2.type = "sawtooth";
    this.oscillator.type = update as OscillatorType;
  }

  private toggleSecondOscillator() {
    if (this.params.secondOscOn) {
      this.oscillator2Gain.gain.value = GAIN_MAX - 0.2;
    } else {
      this.oscillator2Gain.gain.value = 0;
    }
  }

  private createImpulseResponse(decayTimeInSeconds: number) {
    const sampleRate = this.audio.sampleRate;
    const length = 2 * sampleRate; // 2 seconds
    const impulse = this.audio.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.exp(-i / (sampleRate * decayTimeInSeconds));
        channelData[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    return impulse;
  }
}

export const synthEngine = new SynthEngine();
