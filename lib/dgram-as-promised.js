'use strict'

var dgram = require('dgram')

var Promise = require('any-promise')

function SocketAsPromised (socket) {
  this.socket = socket
}

SocketAsPromised.prototype.constructor = SocketAsPromised

SocketAsPromised.prototype.bind = function () {
  var this$ = this
  return new Promise(function (resolve) {
    this$.socket.bind(function () {
      resolve()
    })
  })
}

SocketAsPromised.prototype.addMembership = function (multicastAddress, multicastInterface) {
  return this.socket.addMembership(multicastAddress, multicastInterface)
}

SocketAsPromised.prototype.close = function () {
  var this$ = this
  return new Promise(function (resolve, reject) {
    try {
      this$.socket.close(function () {
        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

SocketAsPromised.prototype.send = function (msg, offset, length, port, address) {
  var this$ = this
  return new Promise(function (resolve, reject) {
    try {
      this$.socket.send(msg, offset, length, port, address, function () {
        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

SocketAsPromised.prototype.setBroadcast = function (flag) {
  return this.socket.setBroadcast(flag)
}

SocketAsPromised.prototype.setMulticastTTL = function (ttl) {
  return this.socket.setMulticastTTL(ttl)
}

module.exports = {
  createSocket: function (opts, cb) {
    if (typeof opts === 'string') {
      opts = {
        type: opts
      }
    }
    return new SocketAsPromised(dgram.createSocket.apply(dgram.createSocket, arguments))
  }
}
