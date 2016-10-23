const sonos = require('sonos')

var sonosSearch = sonos.search()
sonosSearch.on('DeviceAvailable', (device) => {
  sonosInterface.devices.set(device.host, device)
  console.log(`Device found ${device.host}`)
  if (!sonosInterface.device) {
    sonosInterface.selectDevice(device.host)
  }
})

var sonosInterface = {
  device: null,
  devices: new Map(),

  selectDevice (host) {
    this.device = this.devices.get(host) || this.device
    console.log(`Set device to ${this.device.host}`)
  },

  getDevices () {
    return [...this.devices.values()]
  }
}

module.exports = sonosInterface
