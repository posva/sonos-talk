const Gtts = require('./gtts/gTTs')
const fs = require('fs')
const myip = require('quick-local-ip')
const sonos = require('./sonos')
const utils = require('./utils')

const sendFileOptions = {
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
}

module.exports = {
  generateSpeech (req, res) {
    const text = utils.decodeText(req.params.file)

    console.log(`Requested ${text}`)
    const gtts = new Gtts(text, req.params.lang)
    res.set('Content-Type', 'audio/mpeg')
    gtts.stream().pipe(res)
  },

  speakText (req, res) {
    const encodedText = utils.encodeText(decodeURI(req.params.text))
    const uri = `/api/generate/${req.params.lang}/${encodedText}.mp3`
    const url = `http://${myip.getLocalIP4()}:${process.env.PORT}${uri}`
    console.log(`Sending ${url} to Sonos`)
    if (sonos.device) {
      sonos.device.play(url, function (err, playing) {
        if (err) return res.status(500).json({ error: 'Sonos error', err })
        res.json({ ok: playing })
      })
    } else {
      res.status(404).json({
        error: 'Sonos not found',
        request: url
      })
    }
  }
}
