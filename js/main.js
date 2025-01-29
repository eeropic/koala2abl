import * as fflate from "../lib/fflate.js"

import {
  PadToDrumRackSlot,
  PadToSampler,
  QuokkaPadToDrift,
  sequenceToClipSlots,
  koalaToAblDevice,
} from "./ablkoala.js"

import { saveAs, stringifyAndEncode, decodeAndParse } from "./utils.js"

function processKoalaDocument(file) {
  const sequenceData = decodeAndParse(file["sequence.json"])
  const samplerData = decodeAndParse(file["sampler/sampler.json"])
  const mixerData = decodeAndParse(file["mixer.json"])

  const bpm = sequenceData.bpm || 120

  let trackCount = 1

  console.log(sequenceData)
  console.log(samplerData)

  samplerData.pads.forEach((padData) => {
    const padNumber = padData.pad
    padData.hasPitchVariation = false
    padData.track = 0
    // koala pads with varying pitch go to separate tracks
    sequenceData.sequences.forEach((sequence) =>
      sequence.pattern?.notes?.forEach((note) => {
        if (padNumber == note.num && note.pitch != 0 && !padData.hasPitchVariation) {
          padData.hasPitchVariation = true
          padData.track = trackCount++
        }
      })
    )
    console.log(padData.pad, padData.type, padData.hasPitchVariation, padData.track)
  })

  const tracks = []

  for (let trackNumber = 0; trackNumber < trackCount; trackNumber++) {
    // handle sequences
    const clipSlots = sequenceToClipSlots(sequenceData, samplerData, trackNumber)

    // handle tracks + devices
    if (trackNumber == 0) {
      tracks.push({
        kind: "midi",
        name: `Koala-${trackNumber}`,
        clipSlots,
        devices: [
          {
            presetUri: null,
            kind: "drumRack",
            name: "KoalaRack",
            chains: samplerData.pads.filter((padData) => padData.track == 0).map(PadToDrumRackSlot),
          },
        ],
      })
    } else {
      const padObject = samplerData.pads.find((padData) => padData.track == trackNumber)
      let pan = 0.0
      let vol = 0.0
      if (padObject.type == "sample") {
        pan = padObject.pan * 2.0 - 1.0
        vol = (padObject.vol - 1) * 6.0
      } else {
        pan = padObject.synthParams.padParams.pan * 2.0 - 1.0
        vol = (padObject.synthParams.padParams.vol - 1) * 6.0
      }
      tracks.push({
        kind: "midi",
        name: `Koala-${trackNumber}`,
        clipSlots,
        devices: [
          padObject.type == "sample" ? PadToSampler(padObject) : QuokkaPadToDrift(padObject),
        ],
        mixer: {
          pan: pan * 50.0,
          vol,
        },
      })
    }
  }

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
        pan: 0.0,
        volume: 0.0,
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
    console.log(decompressed)
    const files = Object.keys(decompressed)
    console.log(files)

    const outputData = processKoalaDocument(decompressed)

    decompressed["Song.abl"] = stringifyAndEncode(outputData)

    // clean up
    Object.keys(decompressed).forEach(
      (filename) => filename.includes(".json") && delete decompressed[filename]
    )

    const compressed = fflate.zipSync(decompressed)

    saveAs(new Blob([compressed], { type: "application/zip" }), outputFilename)
  }

  reader.readAsArrayBuffer(this.files[0])
}

document.querySelector(".file-input").addEventListener("change", fileInputHandler, false)
