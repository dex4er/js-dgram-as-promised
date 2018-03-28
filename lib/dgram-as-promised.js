'use strict'

const dgram = require('dgram')

class SocketAsPromised {
  constructor (socket) {
    this.socket = socket
  }

  bind (...args) {
    return new Promise(resolve => {
      this.socket.bind(...args, () => {
        const address = this.socket.address()
        resolve(address)
      })
    })
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
        this.socket.send(msg, offset, length, port, address, (err, sent) => {
          if (err) {
            reject(err)
          } else {
            resolve(sent)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}

for (const method of [
  'address', 'setBroadcast', 'setTTL', 'setMulticastTTL',
  'setMulticastInterface', 'setMulticastLoopback', 'addMembership',
  'dropMembership', 'setRecvBufferSize', 'setSendBufferSize',
  'getRecvBufferSize', 'getSendBufferSize'
]) {
  SocketAsPromised.prototype[method] = function (...args) {
    return this.socket[method](...args)
  }
}

for (const method of ['ref', 'unref']) {
  SocketAsPromised.prototype[method] = function (...args) {
    this.socket[method](...args)
    return this
  }
}

function createSocket (options, callback) {
  if (typeof options === 'string') {
    options = {
      type: options
    }
  }
  return new SocketAsPromised(dgram.createSocket(options, callback))
}

module.exports = {
  createSocket: createSocket
}
