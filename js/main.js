import * as fflate from "../lib/fflate.js"

import {
  PadToDrumRackSlot,
  PadToSampler,
  QuokkaPadToDrift,
  sequenceToClipSlots,
  koalaToAblDevice,
  sampleEQToChannelEQ
} from "./ablkoala.js"

import { saveAs, stringifyAndEncode, decodeAndParse, zeropadNum, parseWavData } from "./utils.js"

function storeSampleLengths(data, document){
  data.pads
  .filter(pad => pad.type === "sample")
  .forEach(padObj => {
    const samplePath = `sampler/${padObj.sampleId}.wav`
    const { lengthInSamples, sampleRate } = parseWavData(document[samplePath]);
    padObj.sampleLength = lengthInSamples;
    padObj.sampleRate = sampleRate;
  })
}

function storePitchVariations(data, sequenceData){
  data.pads.forEach((padData) => {
    const padNumber = padData.pad
    padData.hasPitchVariation = false
    padData.bus ??= padData.synthParams.padParams.bus ?? -1
    sequenceData.sequences.forEach((sequence) =>
      sequence.pattern?.notes?.forEach((note) => {
        if (padNumber == note.num && note.pitch != 0 && !padData.hasPitchVariation) {
          padData.hasPitchVariation = true
        }
      })
    )
  })
}

function processKoalaDocument(file) {
  const sequenceData = decodeAndParse(file["sequence.json"])
  const samplerData = decodeAndParse(file["sampler/sampler.json"])
  const mixerData = decodeAndParse(file["mixer.json"])

  storeSampleLengths(samplerData, file)

  const bpm = sequenceData.bpm || 120

  if(samplerData.pads == null) return null

  storePitchVariations(samplerData, sequenceData)

  const tracks = []

  const usedBuses = [
    ...new Set(
      samplerData.pads
        .filter((p) => !p.hasPitchVariation)
        .map((p) => p.bus)
    ),
  ].sort((a, b) => a - b)

  const pitchPads = samplerData.pads.filter((p) => p.hasPitchVariation)

  usedBuses.forEach((busValue, index) => {
    const busPads = samplerData.pads.filter(
      (p) => p.bus === busValue && !p.hasPitchVariation
    )
    if (!busPads.length) return
    const clipSlots = sequenceToClipSlots(sequenceData, busPads)
    
    const busEffects = busValue >= 0 
    ? mixerData.buses[busValue].chain
      .filter(device => device != null)
      .map(device => koalaToAblDevice[device.name](device)) 
    : []

    tracks.push({
      kind: "midi",
      name: {"-1": "Main", 0: "Bus A", 1: "Bus B", 2: "Bus C", 3: "Bus D"}[busValue],
      clipSlots,
      devices: [
        {
          presetUri: null,
          kind: "drumRack",
          name: "KoalaRack",
          chains: busPads.map(PadToDrumRackSlot),
        },
        ...busEffects
      ],
    })
  })  

  pitchPads.forEach((pad, i, pads) => {
    const clipSlots = sequenceToClipSlots(sequenceData, [pad])
    const pan = ((pad.type === "sample" ? pad.pan : pad.synthParams.padParams.pan) * 2 - 1) * 50
    const vol = (pad.type === "sample" ? pad.vol : pad.synthParams.padParams.vol - 1) * 6
    const bus = pads[0].bus

    const busEffects = bus >= 0 
      ? mixerData.buses[bus].chain
        .filter(device => device != null)
        .map(device => koalaToAblDevice[device.name](device)) 
      : []

    const padEq = pad.type === "sample"
      ? pad.eq
      : pad.synthParams.padParams.eq

    const padEqDevices = padEq.enabled === "true"
      ? [sampleEQToChannelEQ(padEq)]
      : []

      const label = pad.type === "sample"
      ? pad.label
      : (pad.uiState.currentPreset.match(/([^/]+)\.[^/.]+$/)?.[1] || "");

    tracks.push({
      kind: "midi",
      name: label.length ? label : `Pad ${pad.pad}`,
      clipSlots,
      devices: [
        pad.type === "sample" ? PadToSampler(pad) : QuokkaPadToDrift(pad, true),
        ...padEqDevices,
        ...busEffects
      ],
      mixer: { pan, vol },
    })
  })

  // Build output data
  return {
    $schema: "http://tech.ableton.com/schema/song/1.4.5/song.json",
    tempo: bpm,
    rootNote: 0,
    scale: "Major",
    melodicLayout: "chromatic",
    tracks,
    masterTrack: {
      color: 0,
      devices: mixerData.master.chain
        .filter(device => device != null)
        .map(device => koalaToAblDevice[device.name](device)),
      mixer: {
        volume: (mixerData.master.volume - 1) * 6.0,
      },
    },
  }
}

const fileInput = document.querySelector(".file-input")

function fileInputHandler() {
  const outputFilename = this.files[0].name.replace(".koala", ".ablbundle")
  const reader = new FileReader()
  reader.onload = function (event) {
    const fileData = new Uint8Array(event.target.result)
    const decompressed = fflate.unzipSync(fileData)
    const files = Object.keys(decompressed)
    const outputData = processKoalaDocument(decompressed)
    if(outputData == null) return
    decompressed["Song.abl"] = stringifyAndEncode(outputData)
    Object.keys(decompressed).forEach(filename => filename.includes(".json") && delete decompressed[filename])
    const compressed = fflate.zipSync(decompressed)
    saveAs(new Blob([compressed], { type: "application/zip" }), outputFilename)
  }
  reader.readAsArrayBuffer(this.files[0])
}

document.querySelector(".file-input").addEventListener("change", fileInputHandler, false)
