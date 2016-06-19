/* eslint-env mocha */
const proxyquire = require('proxyquire')

const api = proxyquire('../server/api', {
  gtts: function () {
    this.save = (file, cb) => {
      cb()
    }
  }
})

describe('API', () => {
  it.skip('calls the gtts service', (done) => {
    api.generateSpeech({
      params: {file: 'test.mp3'}
    }, {
      status () { return this },
      sendFile (file, options, cb) {
        cb(null)
      },
      end () {
        true.should.be.true
        done()
      }
    })
  })
})
