const sonos = require('sonos')

var sonosSearch = sonos.search()
const promise = new Promise((resolve) => {
  sonosSearch.on('DeviceAvailable', (device) => {
    sonosSearch.destroy()
    console.log(`Device found ${device}`)
    sonosInterface.device = device
    resolve(device)
  })
})

var sonosInterface = {
  promise: promise,
  device: null
}

promise.catch((err) => {
  console.error(err)
})

module.exports = sonosInterface
