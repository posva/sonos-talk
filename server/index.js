const express = require('express')
const sonos = require('sonos')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const myip = require('quick-local-ip')
const Gtts = require('gtts')

var sonosDevice = null
var sonosSearch = sonos.search()

process.env.PORT = process.env.PORT || 8080
const app = express()

app.get('/api/generate/:file', (req, res) => {
  const options = {
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  const file = path.resolve(__dirname, './cache', req.params.file)
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
})

app.get('/api/play/:text', (req, res) => {
  const text = _.kebabCase(req.params.text)
  const url = `http://${myip.getLocalIP4()}:${process.env.PORT}/api/generate/${text}.mp3`
  sonosDevice.play(url, function (err, playing) {
    if (err) return res.status(500).send(err)
    res.send(playing)
  })
})

app.use('/', express.static('./cache'))

sonosSearch.on('DeviceAvailable', (device) => {
  sonosDevice = device
  sonosSearch.destroy()
})

module.exports = app.listen(process.env.PORT, () => {
  console.info(`Listening on ${process.env.PORT}`)
})
