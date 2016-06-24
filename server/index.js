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
if (process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'debug' &&
    process.env.NODE_ENV !== 'testing') {
  const webpackMiddleware = require('../build/dev-server')
  webpackMiddleware(app, express.static('./static'))
} else {
  app.use('/', express.static('./dist'))
}

module.exports = app.listen(process.env.PORT, () => {
  console.info(`Listening on ${process.env.PORT}`)
})
