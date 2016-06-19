const express = require('express')
const api = require('./api')

process.env.PORT = process.env.PORT || 8080
const app = express()

app.get('/api/generate/:file', api.generateSpeech)
app.get('/api/speak/:text', api.speakText)
app.use('/', express.static('./cache'))

module.exports = app.listen(process.env.PORT, () => {
  console.info(`Listening on ${process.env.PORT}`)
})
