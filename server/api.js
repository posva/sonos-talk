const Gtts = require('gtts')
const fs = require('fs')
const myip = require('quick-local-ip')
const sonos = require('./sonos')
const utils = require('./utils')

const sendFileOptions = function () {
  return {
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
}

module.exports = {
  generateSpeech (req, res) {
    const text = utils.decodeText(req.params.file)
    const fileName = utils.getFileNameForText(req.params.lang, text)
    const filePath = utils.getFilePath(fileName)

    console.log(`Requested ${text}`)

    if (!fs.existsSync(filePath)) {
      const gtts = new Gtts(text, req.params.lang)

      gtts.save(filePath, function (err, result) {
        if (err) return res.status(500).json({ error: 'Could not save the file' })
        res.sendFile(filePath, sendFileOptions(), (err) => {
          if (err) {
            console.error(`Cannot send ${fileName}`)
            res.status(err.status).end()
          } else {
            console.log(`Sent: ${fileName}`)
          }
        })
      })
    } else {
      res.sendFile(filePath, sendFileOptions(), (err) => {
        if (err) {
          console.error(`Cannot send ${fileName}`)
          res.status(err.status).end()
        } else {
          console.log(`Sent: ${fileName}`)
        }
      })
    }
  },

  playFile (req, res) {
    const uri = `/api/serve/${req.params.file}.mp3`
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
  },

  serveFile (req, res) {
    const fileName = req.params.file
    const filePath = utils.getFilePath(fileName)

    res.sendFile(filePath, sendFileOptions(), (err) => {
      if (err) {
        console.error(`Cannot send ${fileName}`)
        res.status(err.status).end()
      } else {
        console.log(`Sent: ${fileName}`)
      }
    })
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
  },

  getDevices (req, res) {
    res.json({
      devices: sonos.getDevices()
    })
  },

  selectDevice (req, res) {
    sonos.selectDevice(req.params.host)
    res.json({
      device: sonos.device
    })
  }
}
