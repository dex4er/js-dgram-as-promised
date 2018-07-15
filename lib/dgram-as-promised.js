'use strict'

const dgram = require('dgram')

/**
 * @class
 * @param {Socket} socket
 */
class SocketAsPromised {
  constructor (socket) {
    this.socket = socket
  }

  /**
   * @async
   * @param {number} [port]
   * @param {string} [address]
   * @param {object} [options]
   * @returns {Promise<AddressInfo>}
   */
  bind (...args) {
    return new Promise(resolve => {
      this.socket.bind(...args, () => {
        const address = this.socket.address()
        resolve(address)
      })
    })
  }

  /**
   * @async
   * @returns {Promise<undefined>}
   */
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

  /**
   * @async
   * @param {Buffer | string | Array} msg
   * @param {number} [offset]
   * @param {number} [length]
   * @param {number} port
   * @param {string} address
   * @returns {Promise<number>}
   */
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

/**
 * @callback createSocketCallback
 * @param {Buffer} msg
 * @param {RemoteInfo} rinfo
 */

/**
 * @param {SocketType | SocketOptions | string} options
 * @param {createSocketCallback} callback
 * @returns {SocketAsPromised}
 */
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
