const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const api = require('./api')

process.env.PORT = process.env.PORT || 8080
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/generate/:lang/:file', api.generateSpeech)
app.get('/api/speak/:lang/:text', api.speakText)
// TODO create front app
app.use('/', express.static('./dist'))

module.exports = app.listen(process.env.PORT, () => {
  console.info(`Listening on ${process.env.PORT}`)
})
