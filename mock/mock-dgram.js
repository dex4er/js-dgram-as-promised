'use strict'

const EventEmmiter = require('events').EventEmitter

class Socket extends EventEmmiter {
  constructor () {
    super()
    this._closed = false
  }

  addMembership (multicastAddress, multicastInterface) {}

  address () {
    return {
      address: '127.0.0.1',
      port: 12345,
      family: 'udp4'
    }
  }

  bind (options, callback) {
    if (typeof options === 'function') {
      callback = options
    }
    callback()
  }

  close (callback) {
    if (this._closed) {
      throw new Error('already closed')
    } else {
      this.emit('close')
      this._closed = true
    }
  }

  send (msg, offset, length, port, address, callback) {
    if (!msg) {
      throw new Error('wrong message')
    } else {
      callback(null, length)
    }
  }

  setBroadcast (flag) {}

  setMulticastTTL (ttl) {}
}

function createSocket (type, _callback) {
  return new Socket()
}

module.exports = {
  Socket,
  createSocket
}
