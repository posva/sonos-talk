const sonos = require('sonos')

var sonosSearch = sonos.search()

module.exports = {
  promise: new Promise((resolve) => {
    sonosSearch.on('DeviceAvailable', (device) => {
      sonosSearch.destroy()
      this.device = device
      resolve(device)
    })
  }),
  device: null
}
