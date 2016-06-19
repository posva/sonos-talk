const sha1 = require('sha1')
const path = require('path')

module.exports = {
  getFileNameForText (lang, text) {
    return `${sha1(text)}_${lang}.mp3`
  },
  getFilePath (fileName) {
    return path.resolve(__dirname, '../cache', fileName)
  },
  encodeText (text) {
    return encodeURI(Buffer(text).toString('base64'))
  },
  decodeText (base64) {
    return decodeURI(Buffer(base64, 'base64').toString('utf8'))
  }
}
