const Gtts = require('gtts')
const fs = require('fs')
const path = require('path')
const myip = require('quick-local-ip')
const _ = require('lodash')
const sonos = require('./sonos')

module.exports = {
  generateSpeech (req, res) {
    const options = {
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
    const file = path.resolve(__dirname, '../cache', req.params.file)
    if (!fs.existsSync(file)) {
      const gtts = new Gtts(req.params.file, 'fr')

      gtts.save(file, function (err, result) {
        if (err) return res.status(500).send(err)
        res.sendFile(file, options, (err) => {
          if (err) {
            console.error(`Cannot send ${file}`)
            res.status(err.status).end()
          } else {
            console.log(`Sent: ${file}`)
          }
        })
      })
    } else {
      res.sendFile(file, options, (err) => {
        if (err) {
          console.error(`Cannot send ${file}`)
          res.status(err.status).end()
        } else {
          console.log(`Sent: ${file}`)
        }
      })
    }
  },

  speakText (req, res) {
    const text = _.kebabCase(req.params.text)
    const url = `http://${myip.getLocalIP4()}:${process.env.PORT}/api/generate/${text}.mp3`
    sonos.device.play(url, function (err, playing) {
      if (err) return res.status(500).send(err)
      res.send(playing)
    })
  }
}
