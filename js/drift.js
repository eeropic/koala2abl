/*
  Live clamps values to min/max, so setting filter freq to 30khz will be clamped to 20khz
  !!! HOWEVER having float value in a field that should be integer will result in "Document Invariant Violation"

  Also, entries can be omitted, and Live will use default values for omitted fields

  this is only for reference, parameter ranges denoted as arrays
*/

const drift = {
  presetUri: null,
  kind: 'drift',
  name: 'Drift',
  parameters: {
    CyclingEnvelope_Hold: [0.0, 1.0],
    CyclingEnvelope_MidPoint: [0.0, 1.0],
    CyclingEnvelope_Mode: ['Freq', 'Ratio', 'Time', 'Sync'],
    CyclingEnvelope_Rate: [0.17, 1700], // hz
    CyclingEnvelope_Ratio: [0.25, 16.0], 
    CyclingEnvelope_SyncedRate: [0, 21], // from 1/64 to 8 bars
    CyclingEnvelope_Time: [0.1, 60.0], // seconds
    Enabled: true,
    Envelope1_Attack: [0.0, 60.0], // seconds
    Envelope1_Decay: [0.005, 60.0], // seconds
    Envelope1_Release: [0.010, 60.0], // seconds
    Envelope1_Sustain: [0.0, 1.0],
    Envelope2_Attack: [0.0, 60.0], // seconds
    Envelope2_Decay: [0.005, 60.0], // seconds
    Envelope2_Release: [0.010, 60.0], // seconds
    Envelope2_Sustain: [0.0, 1.0],
    Filter_Frequency: [20.0, 20000.0], // hz
    Filter_HiPassFrequency: [10.0, 20500], // hz
    Filter_ModAmount1: [-1.0, 1.0],
    Filter_ModAmount2: [-1.0, 1.0],
    Filter_ModSource1: ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
    Filter_ModSource2: ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
    Filter_NoiseThrough: true,
    Filter_OscillatorThrough1: true,
    Filter_OscillatorThrough2: true,
    Filter_Resonance: [0.0, 1.01],
    Filter_Tracking: [0.0, 1.0],
    Filter_Type: ['I', 'II'],
    Global_DriftDepth: [0.0, 1.0],
    Global_Envelope2Mode: ['Env', 'Cyc'],
    Global_Glide: [0.0, 2.0], // seconds
    Global_HiQuality: false,
    Global_Legato: false,
    Global_MonoVoiceDepth: [0.0, 1.0],
    Global_NotePitchBend: true,
    Global_PitchBendRange: [0, 12],
    Global_PolyVoiceDepth: [0.0, 1.0], // unused?
    Global_ResetOscillatorPhase: false,
    Global_SerialNumber: 0,
    Global_StereoVoiceDepth: [0.0, 1.0],
    Global_Transpose: [-48, 48],
    Global_UnisonVoiceDepth: [0.0, 1.0],
    Global_VoiceCount: ['4', '8', '16', '24', '32'],
    Global_VoiceMode: ['Poly', 'Mono', 'Stereo', 'Unison'],
    Global_VolVelMod: [0.0, 1.0],
    Global_Volume: [0.0, 1.0],  // -inf / -60db ... 0.0db
    Lfo_Amount: [0.0, 1.0],
    Lfo_ModAmount: [-1.0, 1.0],
    Lfo_ModSource: ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
    Lfo_Mode: ['Freq', 'Ratio', 'Time', 'Sync'],
    Lfo_Rate: [0.2, 1700.0], // hz
    Lfo_Ratio: [0.25, 16.0],
    Lfo_Retrigger: false,
    Lfo_Shape: ['Sine', 'Triangle', 'Saw Up', 'Saw Down', 'Square', 'Sample & Hold', 'Wander', 'Linear Env', 'Exponential Env'],
    Lfo_SyncedRate: [0, 21], // from 1/64 to 8 bars
    Lfo_Time: [0.1, 60.0], // seconds
    Mixer_NoiseLevel: [0.0, 2.0],
    Mixer_NoiseOn: true,
    Mixer_OscillatorGain1: [0.0, 2.0], // 1.0 == 0db, 2.0 = +6db
    Mixer_OscillatorGain2: [0.0, 2.0], // 1.0 == 0db, 2.0 = +6db
    Mixer_OscillatorOn1: true,
    Mixer_OscillatorOn2: true,
    ModulationMatrix_Amount1: [-1.0, 1.0],
    ModulationMatrix_Amount2: [-1.0, 1.0],
    ModulationMatrix_Amount3: [-1.0, 1.0],
    ModulationMatrix_Source1: ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
    ModulationMatrix_Source2: ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
    ModulationMatrix_Source3: ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
    ModulationMatrix_Target1: ['None', 'Osc 1 Gain', 'Osc 1 Shape', 'Osc 2 Gain', 'Osc 2 Detune', 'Noise Gain', 'LP Frequency', 'LP Resonance', 'HP Frequency', 'LFO Rate', 'Cyc Env Rate', 'Main Volume'],
    ModulationMatrix_Target2: ['None', 'Osc 1 Gain', 'Osc 1 Shape', 'Osc 2 Gain', 'Osc 2 Detune', 'Noise Gain', 'LP Frequency', 'LP Resonance', 'HP Frequency', 'LFO Rate', 'Cyc Env Rate', 'Main Volume'],
    ModulationMatrix_Target3: ['None', 'Osc 1 Gain', 'Osc 1 Shape', 'Osc 2 Gain', 'Osc 2 Detune', 'Noise Gain', 'LP Frequency', 'LP Resonance', 'HP Frequency', 'LFO Rate', 'Cyc Env Rate', 'Main Volume'],
    Oscillator1_Shape: [0.0, 1.0],
    Oscillator1_ShapeMod: [-1.0, 1.0],
    Oscillator1_ShapeModSource: ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
    Oscillator1_Transpose: [-2, -1, 0, 1, 2, 3],
    Oscillator1_Type: ['Sine', 'Triangle', 'Shark Tooth','Saturated', 'Saw', 'Pulse', 'Rectangle'],
    Oscillator2_Detune: [-7.0, 7.0],
    Oscillator2_Transpose: [-3, -2, -1, 0, 1, 2],
    Oscillator2_Type: ['Sine', 'Triangle', 'Saturated', 'Saw', 'Rectangle'],
    PitchModulation_Amount1: [-1.0, 1.0],
    PitchModulation_Amount2: [-1.0, 1.0],
    PitchModulation_Source1: ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
    PitchModulation_Source2: ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
  },
  deviceData: {},
}
