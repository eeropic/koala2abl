import { zeropadNum } from "./utils.js"

const remapNoise = (value) => (value <= 0.7 ? 0.0 : (value - 0.7) / (1.0 - 0.7))

const oscillatorWaveforms = [
  "Sine",
  "Triangle",
  "Shark Tooth",
  "Saturated",
  "Saw",
  "Pulse",
  "Rectangle",
]

const getOscillator = (shape) => {
  if (shape < 0.2) return "Saw"
  else if (shape >= 0.2 && shape < 0.5) return "Rectangle"
  else if (shape >= 0.5) return "Sine"
}

export function QuokkaPadToDrift(sampleData) {
  const { synthParams } = sampleData

  return {
    presetUri: null,
    kind: "drift",
    name: "Drift",
    parameters: {
      Enabled: true,
      Envelope1_Attack: synthParams.ampEnvAttack,
      Envelope1_Decay: synthParams.ampEnvDecay,
      Envelope1_Release: synthParams.ampEnvRelease,
      Envelope1_Sustain: synthParams.ampEnvSustain,
      Envelope2_Attack: 0.0,
      Envelope2_Decay: synthParams.modEnvDecay,
      Envelope2_Release: synthParams.modEnvDecay,
      Envelope2_Sustain: 0.0,
      Filter_Frequency: synthParams.filterMode < 2 ? synthParams.cutoff : 20000,
      Filter_HiPassFrequency: synthParams.filterMode == 2 ? synthParams.cutoff: 10.0,
      // ["Lowpass", "Bandpass", "Highpass"][synthParams.filterMode]
      Filter_ModAmount1: synthParams.lfoTarget == 3 ? synthParams.lfoDepth * 0.5 : 0.0, // [-1.0, 1.0],
      Filter_ModAmount2: synthParams.modEnvTarget == 3 ? synthParams.modEnvDepth : 0.0, // [-1.0, 1.0],
      Filter_ModSource1: "LFO", // ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
      Filter_ModSource2: "Env 2 / Cyc", // ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
      Filter_NoiseThrough: true,
      Filter_OscillatorThrough1: true,
      Filter_OscillatorThrough2: false,
      Filter_Resonance: synthParams.resonance, // [0.0, 1.01],
      Filter_Tracking: 0.0, // [0.0, 1.0],
      Filter_Type: "I",
      Global_DriftDepth: 0.0, // [0.0, 1.0],
      Global_Envelope2Mode: "Env",
      Global_Glide: synthParams.portamento, // [0.0, 2.0], // seconds
      Global_HiQuality: true,
      Global_Legato: true,
      Global_MonoVoiceDepth: 0.0, // [0.0, 1.0],
      // Global_NotePitchBend: false,
      // Global_PitchBendRange: [0, 12],
      // Global_PolyVoiceDepth: [0.0, 1.0], // unused?
      // Global_StereoVoiceDepth: [0.0, 1.0],
      // Global_UnisonVoiceDepth: [0.0, 1.0],
      // Global_SerialNumber: 0,
      Global_ResetOscillatorPhase: false,
      Global_Transpose: Math.round((synthParams.octave - 2) * 12.0 + synthParams.padParams.pitch), // [-48, 48],
      Global_VoiceCount: "8", // ['4', '8', '16', '24', '32'],
      Global_VoiceMode: (synthParams.voiceMode == 0 ? "Poly" : "Mono") || "Poly", // ['Poly', 'Mono', 'Stereo', 'Unison'],
      Global_VolVelMod: 0.0, // [0.0, 1.0],
      Global_Volume: synthParams.padParams.vol, // [0.0, 1.0],  // -inf / -60db ... 0.0db
      Lfo_Mode: synthParams.lfoSync ? "Sync" : "Freq", // ['Freq', 'Ratio', 'Time', 'Sync'],
      Lfo_Rate: synthParams.lfoSpeed, // [0.2, 1700.0], // hz
      Lfo_Retrigger: true,
      Lfo_Shape: ["Sine", "Square", "Triangle", "Saw Down", "Saw Up", "Sample & Hold", "Wander"][
        synthParams.lfoMode
      ], // ['Sine', 'Triangle', 'Saw Up', 'Saw Down', 'Square', 'Sample & Hold', 'Wander', 'Linear Env', 'Exponential Env'],
      Lfo_SyncedRate: 21.0 - synthParams.lfoSyncSpeed, // [0, 21], // from 1/64 to 8 bars

      /*
        Lfo_Amount: [0.0, 1.0],
        Lfo_ModAmount: [-1.0, 1.0],
        Lfo_ModSource: ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
        Lfo_Ratio: [0.25, 16.0],
        Lfo_Time: [0.1, 60.0], // seconds
        Mixer_OscillatorGain2: [0.0, 2.0], // 1.0 == 0db, 2.0 = +6db
        Mixer_OscillatorOn1: true,
      */
      /*

      */

      ModulationMatrix_Source1: "LFO", // ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
      ModulationMatrix_Target1: synthParams.lfoTarget == 2 ? "Osc 1 Shape" : synthParams.lfoTarget == 4 ? "Main Volume" : "None", // ['None', 'Osc 1 Gain', 'Osc 1 Shape', 'Osc 2 Gain', 'Osc 2 Detune', 'Noise Gain', 'LP Frequency', 'LP Resonance', 'HP Frequency', 'LFO Rate', 'Cyc Env Rate', 'Main Volume'],
      ModulationMatrix_Amount1: synthParams.lfoDepth * (synthParams.lfoTarget == 2 ? 0.5 : 1.0), // [-1.0, 1.0],

      ModulationMatrix_Source2: "Env 2 / Cyc", // ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
      ModulationMatrix_Target2: "Osc 1 Gain", // ['None', 'Osc 1 Gain', 'Osc 1 Shape', 'Osc 2 Gain', 'Osc 2 Detune', 'Noise Gain', 'LP Frequency', 'LP Resonance', 'HP Frequency', 'LFO Rate', 'Cyc Env Rate', 'Main Volume'],
      ModulationMatrix_Amount2: (synthParams.modEnvTarget == 1 && synthParams.oscillatorMode > 0.5) ? -synthParams.modEnvDepth : 0.0, // [-1.0, 1.0],

      ModulationMatrix_Source3: "Env 2 / Cyc", // ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
      ModulationMatrix_Target3: "Noise Gain", // ['None', 'Osc 1 Gain', 'Osc 1 Shape', 'Osc 2 Gain', 'Osc 2 Detune', 'Noise Gain', 'LP Frequency', 'LP Resonance', 'HP Frequency', 'LFO Rate', 'Cyc Env Rate', 'Main Volume'],
      ModulationMatrix_Amount3: (synthParams.modEnvTarget == 1 && synthParams.oscillatorMode > 0.5) ? synthParams.modEnvDepth : 0.0, // [-1.0, 1.0], // [-1.0, 1.0],

      Mixer_OscillatorGain1: 1.0 - remapNoise(synthParams.oscillatorMode) * 2.0, // [0.0, 2.0], // 1.0 == 0db, 2.0 = +6db
      Mixer_NoiseLevel: (synthParams.modEnvTarget == 1 && synthParams.oscillatorMode > 0.5) ? 2 - synthParams.modEnvDepth : remapNoise(synthParams.oscillatorMode) * 2.0,
      Mixer_NoiseOn: true,
      Mixer_OscillatorOn2: false,
      Oscillator1_Shape: synthParams.oscillatorModifier, // 0.0, // [0.0, 1.0],
      Oscillator1_ShapeMod: synthParams.modEnvTarget == 2 ? synthParams.modEnvDepth * 0.5 : 0.0, // 0.0, // [-1.0, 1.0],
      Oscillator1_ShapeModSource: "Env 2 / Cyc", // ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
      Oscillator1_Transpose: 0, // [-2, -1, 0, 1, 2, 3],
      Oscillator1_Type: getOscillator(synthParams.oscillatorMode), // ['Sine', 'Triangle', 'Shark Tooth','Saturated', 'Saw', 'Pulse', 'Rectangle'],

      PitchModulation_Source1: "LFO", // ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
      PitchModulation_Source2: "Env 2 / Cyc", // ['Env 1', 'Env 2 / Cyc', 'LFO', 'Key', 'Velocity', 'Modwheel', 'Pressure', 'Slide'],
      PitchModulation_Amount1: synthParams.lfoTarget == 0 ? synthParams.lfoDepth : 0.0, // [-1.0, 1.0],
      PitchModulation_Amount2: synthParams.modEnvTarget == 0 ? synthParams.modEnvDepth : 0.0, // [-1.0, 1.0],

      /*
        Voice_Oscillator1_Wavetables_WavePosition: [0.666, 1.0, 0.0, 0.0, 0.0][
          Math.round(synthParams.oscillatorMode * 3)
      */

      /*

      */
    },
    deviceData: {},
  }
}

export function QuokkaPadToWavetable(sampleData) {
  const { synthParams } = sampleData
  return {
    presetUri: null,
    kind: "wavetable",
    name: "Wavetable",
    parameters: {
      Enabled: true,
      HiQ: true,
      MonoPoly: (synthParams.voiceMode == 0 ? "Poly" : "Mono") || "Poly",
      PolyVoices: "8",
      Voice_Filter1_CircuitLpHp: "PRD",
      Voice_Filter1_CircuitBp: "OSR",
      Voice_Filter1_Drive: synthParams.drive * 24.0 || 0,
      Voice_Filter1_Frequency: synthParams.cutoff || 20000.0,
      Voice_Filter1_Morph: 0.0,
      Voice_Filter1_On: true,
      Voice_Filter1_Resonance: synthParams.resonance,
      Voice_Filter1_Slope: "12",
      Voice_Filter1_Type: ["Lowpass", "Bandpass", "Highpass"][synthParams.filterMode] || "Lowpass",
      Voice_Global_Glide: synthParams.portamento || 0.0,
      Voice_Global_Transpose: 0.0,
      Voice_Modulators_Amount: 1.0,
      Voice_Modulators_AmpEnvelope_Slopes_Decay: 1.0,
      Voice_Modulators_AmpEnvelope_Slopes_Release: 0.6,
      Voice_Modulators_AmpEnvelope_Sustain: synthParams.ampEnvSustain,
      Voice_Modulators_AmpEnvelope_Times_Attack: synthParams.ampEnvAttack,
      Voice_Modulators_AmpEnvelope_Times_Decay: synthParams.ampEnvDecay,
      Voice_Modulators_AmpEnvelope_Times_Release: synthParams.ampEnvRelease,
      Voice_Modulators_Envelope2_Values_Sustain: 0.0,
      Voice_Modulators_Envelope2_Times_Attack: 0.001,
      Voice_Modulators_Envelope2_Times_Decay: synthParams.modEnvDecay,
      Voice_Modulators_Envelope2_Times_Release: synthParams.modEnvDecay,
      Voice_Modulators_Lfo1_Retrigger: true,
      Voice_Modulators_Lfo1_Shape_Amount: 1.0,
      Voice_Modulators_Lfo1_Shape_PhaseOffset: 0.0,
      Voice_Modulators_Lfo1_Shape_Shaping: 0.0,
      Voice_Modulators_Lfo1_Shape_Type: [
        "Sine",
        "Rectangle",
        "Triangle",
        "Sawtooth",
        "Sawtooth",
        "Noise",
        "Noise",
      ][synthParams.lfoMode],
      Voice_Modulators_Lfo1_Time_AttackTime: 0.0,
      Voice_Modulators_Lfo1_Time_Rate: synthParams.lfoSpeed,
      Voice_Modulators_Lfo1_Time_Sync: synthParams.lfoSync ? "Tempo" : "Free",
      Voice_Modulators_Lfo1_Time_SyncedRate: 21.0 - synthParams.lfoSyncSpeed,
      Voice_Modulators_Lfo2_Retrigger: true,
      Voice_Modulators_Lfo2_Shape_Amount: 0.5,
      Voice_Modulators_Lfo2_Time_Rate: 1.12,
      Voice_Modulators_Lfo2_Shape_Type: "Sawtooth",
      Voice_Oscillator1_Effects_Effect1: synthParams.oscillatorModifier,
      Voice_Oscillator1_Effects_Effect2: 0.0,
      Voice_Oscillator1_Effects_EffectMode: "Classic",
      Voice_Oscillator1_Gain: 1.0 - remapNoise(synthParams.oscillatorMode),
      Voice_Oscillator1_On: true,
      Voice_Oscillator1_Pan: 0.0,
      Voice_Oscillator1_Pitch_Detune: 0.0,
      Voice_Oscillator1_Pitch_Transpose: Math.round(
        (synthParams.octave - 2) * 12.0 + synthParams.padParams.pitch
      ),
      Voice_Oscillator1_Wavetables_WavePosition: [0.666, 1.0, 0.0, 0.0, 0.0][
        Math.round(synthParams.oscillatorMode * 3)
      ],

      Voice_Oscillator2_On: true,
      Voice_Oscillator2_Gain: remapNoise(synthParams.oscillatorMode),
      Voice_Oscillator2_Pitch_Transpose: -24.0,
      Voice_Oscillator2_Wavetables_WavePosition: 0.5,
      Volume: 0.4,
    },
    deviceData: {
      modulations: {
        Voice_Global_PitchModulation: [
          0,
          (synthParams.modEnvTarget == 0) * synthParams.modEnvDepth,
          0,
          (synthParams.lfoTarget == 0) * synthParams.lfoDepth * 0.38,
          0,
          0,
          0,
          0,
          0,
          0,
          0.002,
          0,
          0,
        ],
        Voice_Oscillator1_Wavetables_WavePosition: [
          0,
          (synthParams.modEnvTarget == 1) * synthParams.modEnvDepth,
          0,
          (synthParams.lfoTarget == 1) * synthParams.lfoDepth,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ],
        Voice_Oscillator1_Effects_Effect1: [
          0,
          (synthParams.modEnvTarget == 2) * synthParams.modEnvDepth,
          0,
          (synthParams.lfoTarget == 2) * synthParams.lfoDepth * 0.25,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ],
        Voice_Filter1_Frequency: [
          0,
          (synthParams.modEnvTarget == 3) * synthParams.modEnvDepth,
          0,
          (synthParams.lfoTarget == 3) * synthParams.lfoDepth,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ],
        Voice_Global_AmpModulation: [
          0,
          0,
          0,
          (synthParams.lfoTarget == 4) * synthParams.lfoDepth,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ],

        Voice_Oscillator2_Wavetables_WavePosition: [0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0.25, 0, 0],
        Voice_Oscillator2_Pitch_PitchModulation: [0, 0, 0, 0, 0, 0, -1.0, 0, 0, 0, 0, 0, 0],
      },
      spriteUri1: "ableton:/device-resources/wavetable-sprites/Basic%20Shapes",
      spriteUri2: "ableton:/device-resources/wavetable-sprites/White%20Noise",
    },
  }
}

export function PadToSampler(padObject) {
  const {
    start = 0,
    end = 0,
    zoomEnd = 0,

    oneshot = true,
    pitch = 0,
    looping = false,
    pan = 0.5,

    attack = 0,
    release = 0,

    vol = 0,
  } = padObject
  return {
    presetUri: null,
    kind: "melodicSampler",
    name: "",
    parameters: {
      Enabled: true,
      Voice_AmplitudeEnvelope_Attack: 0.003 + ((end - start) / zoomEnd) * (zoomEnd / 44100),
      Voice_AmplitudeEnvelope_Decay: 0,
      Voice_AmplitudeEnvelope_Release: 0.003 + ((end - start) / zoomEnd) * (zoomEnd / 44100),
      Voice_AmplitudeEnvelope_Sustain: 1.0,
      Voice_AmplitudeEnvelope_SustainMode: "Gate",
      Voice_Gain: 1.0,
      Voice_PlaybackLength: (end - start) / zoomEnd,
      Voice_PlaybackStart: start / zoomEnd,
      Voice_Transpose: pitch,
      Volume: (vol - 1) * 6.0 - 6.0,
    },
    deviceData: {
      sampleUri: `sampler/${padObject.sampleId}.wav`,
    },
  }
}

export function PadToDrumCell(padObject) {
  const { pad, pan, pitch, start, end, zoomEnd, oneshot, vol, sampleId } = padObject
  return {
    presetUri: null,
    kind: "drumCell",
    name: `pad${pad}-drumcell`,
    parameters: {
      Pan: pan * 2 - 1,
      Voice_Detune: 0.0,
      Voice_Envelope_Attack: 0.002,
      Voice_Envelope_Decay: oneshot == "true" ? 60 : 0,
      Voice_Envelope_Hold: 0.1,
      Voice_Envelope_Mode: oneshot == "true" ? "A-H-D" : "A-S-R",
      Voice_Gain: 1.0,
      Voice_PlaybackLength: (end - start) / zoomEnd,
      Voice_PlaybackStart: start / zoomEnd,
      Voice_Transpose: Math.round(pitch),
      Volume: (vol - 1) * 6 - 6.0,
    },
    deviceData: {
      sampleUri: `sampler/${sampleId}.wav`,
    },
  }
}

export function PadToDrumRackSlot(padObject) {
  const { pad, chokeGroup } = padObject

  let pan = 0.0
  let vol = 0.0
  if (padObject.type == "sample") {
    pan = padObject.pan * 2.0 - 1.0
    vol = (padObject.vol - 1) * 6.0
  } else {
    pan = padObject.synthParams.padParams.pan * 2.0 - 1.0
    vol = (padObject.synthParams.padParams.vol - 1) * 6.0
  }
  return {
    name: padObject.type == "sample" ? pad : `${pad}-${padObject.type}`,
    color: 15,
    devices: [padObject.type == "sample" ? PadToDrumCell(padObject) : QuokkaPadToDrift(padObject)],
    drumZoneSettings: {
      receivingNote: 36 + parseInt(pad),
      sendingNote: 60,
      chokeGroup,
    },
    mixer: {
      pan: pan * 50.0,
      volume: vol,
    },
  }
}

export function sequenceToClipSlots(sequenceData, samplerData, trackNumber) {
  return sequenceData.sequences.map((sequence, sequenceNumber) => {
    if (sequence.pattern.notes != null) {
      const notes = sequence.pattern.notes
        .filter(
          (note) =>
            samplerData.pads.find((padData) => padData.pad == note.num) &&
            samplerData.pads.find((padData) => padData.pad == note.num).track == trackNumber
        )
        .map((note, n) => {
          return {
            noteNumber: trackNumber == 0 ? 36 + note.num : Math.round(60 + note.pitch),
            startTime: note.timeOffset / 4096,
            duration: Math.max(0.01, Math.abs(note.length) / 4096),
            velocity: note.vel,
            offVelocity: note.vel,
          }
        })

      if (notes.length)
        return {
          hasStop: true,
          clip: {
            name: `Sequence ${zeropadNum(sequenceNumber)}`,
            region: {
              start: 0.0,
              end: sequence.pattern.numBars * 4,
              loop: {
                start: 0.0,
                end: sequence.pattern.numBars * 4,
                isEnabled: true,
              },
            },
            notes: clampOverlappingNotes(notes),
          },
        }
      else return { hasStop: true, clip: null }
    } else return { hasStop: true, clip: null }
  })
}

export function clampOverlappingNotes(notes, threshold = 0.05, minDuration = 0.001) {
  const sorted = [...notes].sort((a, b) => {
    if (a.noteNumber !== b.noteNumber) return a.noteNumber - b.noteNumber
    return a.startTime - b.startTime
  })

  const lastNoteForNumber = {}

  for (const note of sorted) {
    const prevNote = lastNoteForNumber[note.noteNumber]
    if (prevNote) {
      const prevEnd = prevNote.startTime + prevNote.duration
      const allowedEnd = note.startTime - threshold
      if (prevEnd > allowedEnd) {
        let newDuration = allowedEnd - prevNote.startTime
        if (newDuration < minDuration) newDuration = minDuration
        prevNote.duration = newDuration
      }
    }
    lastNoteForNumber[note.noteNumber] = note
  }

  return sorted
}

export const limiterPreset = {
  presetUri: null,
  kind: "limiter",
  name: "",
  parameters: {
    AutoRelease: false,
    Ceiling: -0.3,
    Enabled: true,
    Gain: 0.0,
    LegacySmoothing: true,
    LinkAmount: 1.0,
    LinkAmountMidSide: 0.0,
    Lookahead: "1.5 ms",
    Maximize: false,
    MaximizeOutput: 0.0,
    MaximizeThreshold: 0.0,
    Mode: "Standard",
    Release: 100.0,
    Routing: "L/R",
  },
  deviceData: {},
}
