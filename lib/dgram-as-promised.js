'use strict'

const dgram = require('dgram')
const Promise = require('any-promise')

class SocketAsPromised {
  constructor (socket) {
    this.socket = socket
  }

  bind () {
    return new Promise(resolve => {
      this.socket.bind(() => {
        resolve()
      })
    })
  }

  addMembership (multicastAddress, multicastInterface) {
    return this.socket.addMembership(multicastAddress, multicastInterface)
  }

  close () {
    return new Promise((resolve, reject) => {
      try {
        this.socket.once('close', () => {
          resolve()
        })
        this.socket.close()
      } catch (err) {
        reject(err)
      }
    })
  }

  send (msg, offset, length, port, address) {
    return new Promise((resolve, reject) => {
      try {
        this.socket.send(msg, offset, length, port, address, () => {
          resolve()
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  setBroadcast (flag) {
    return this.socket.setBroadcast(flag)
  }

  setMulticastTTL (ttl) {
    return this.socket.setMulticastTTL(ttl)
  }
}

module.exports = {
  createSocket: function createSocket (options, ...callback) {
    if (typeof options === 'string') {
      options = {
        type: options
      }
    }
    return new SocketAsPromised(dgram.createSocket(options, ...callback))
  }
}
