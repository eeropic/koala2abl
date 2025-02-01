export const saveAs = (blob, filename) => {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export const zeropadNum = (num) => num.toString().padStart(2, '0')

export const stringifyAndEncode = (obj) => new TextEncoder().encode(JSON.stringify(obj, null, 2))

export const decodeAndParse = (jsonUintArray) => JSON.parse(new TextDecoder().decode(jsonUintArray))

export function parseWavData(u8Data) {
  const dataView = new DataView(u8Data.buffer);
  
  let fmtChunkOffset = 12;
  while (
    fmtChunkOffset < dataView.byteLength - 8 &&
    (String.fromCharCode(
      dataView.getUint8(fmtChunkOffset),
      dataView.getUint8(fmtChunkOffset + 1),
      dataView.getUint8(fmtChunkOffset + 2),
      dataView.getUint8(fmtChunkOffset + 3)
    ) !== 'fmt ')
  ) {
    fmtChunkOffset += 1;
  }

  const sampleRate = dataView.getUint32(fmtChunkOffset + 12, true);
  const numChannels = dataView.getUint16(fmtChunkOffset + 10, true);
  const bitsPerSample = dataView.getUint16(fmtChunkOffset + 22, true);
  const blockAlign = (numChannels * bitsPerSample) / 8;

  let dataChunkOffset = fmtChunkOffset;
  while (
    dataChunkOffset < dataView.byteLength - 8 &&
    (String.fromCharCode(
      dataView.getUint8(dataChunkOffset),
      dataView.getUint8(dataChunkOffset + 1),
      dataView.getUint8(dataChunkOffset + 2),
      dataView.getUint8(dataChunkOffset + 3)
    ) !== 'data')
  ) {
    dataChunkOffset += 1;
  }

  const dataChunkSize = dataView.getUint32(dataChunkOffset + 4, true);
  const lengthInSamples = dataChunkSize / blockAlign;

  return { lengthInSamples, sampleRate };
}