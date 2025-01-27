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
