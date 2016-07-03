const Gtts = require('gtts')
const myip = require('quick-local-ip')
const sonos = require('./sonos')
const utils = require('./utils')

module.exports = {
  generateSpeech (req, res) {
    const text = utils.decodeText(req.params.file)

    console.log(`Requested "${text}"`)
    const gtts = new Gtts(text, req.params.lang)
    res.set('Content-Type', 'audio/mpeg')
    res.set('Content-Length', 3072)
    res.set('Accept-Ranges', 'bytes')
    res.set('Cache-Control', 'no-cache')
    res.set('Last-Modified', new Date())
    res.set('x-timestamp', +new Date())
    res.removeHeader('Accept')
    res.removeHeader('Accept-Encoding')
    res.removeHeader('Accept-Language')
    const stream = gtts.stream()
    stream.on('pipe', () => {
      console.log('piping')
    }).on('error', (err) => {
      console.log(err)
    }).on('finish', () => {
      console.log('Done writing', text)
    }).on('close', () => {
      res.end()
      console.log('Closed', text)
    })
    stream.pipe(res)
  },

  speakText (req, res) {
    const encodedText = utils.encodeText(decodeURI(req.params.text))
    const uri = `/api/generate/${req.params.lang}/${encodedText}.mp3`
    const url = `http://${myip.getLocalIP4()}:${process.env.PORT}${uri}`
    console.log(`Sending "${url}" to Sonos`)
    if (sonos.device) {
      sonos.device.play(url, function (err, playing) {
        if (err) return res.status(500).json({ error: 'Sonos error', err })
        res.json({ ok: playing, request: url })
      })
    } else {
      res.status(404).json({
        error: 'Sonos not found',
        request: url
      })
    }
  }
}
