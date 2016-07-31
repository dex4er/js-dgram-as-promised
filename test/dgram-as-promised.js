'use strict'

var t = require('tap')
var dgramAsPromised = require('../lib/dgram-as-promised')

var TIMEOUT = 10000

t.plan(1)

t.test('Send datagram', {timeout: TIMEOUT}, function (t) {
  t.plan(5)

  var socket = dgramAsPromised.createSocket('udp4')

  var promise = socket.bind()
  promise.then(function () {
    t.pass('socket.bind is fulfilled')
    var address = '224.0.0.1'
    try {
      socket.setBroadcast(true)
      socket.setMulticastTTL(128)
      socket.addMembership(address)
    } catch (err) {
      address = '127.0.0.1'
    }
    return socket.send(new Buffer('ABCDEFGH'), 0, 8, 41234, address)
  }).then(function () {
    t.pass('socket.send is fulfilled')
    return socket.send('', 0, 0, null, null)
  }).catch(function (err) {
    t.type(err, 'Error', 'socket.send is rejected: ' + err)
    return socket.close()
  }).then(function () {
    t.pass('socket.close is fulfilled')
    return socket.close()
  }).catch(function (err) {
    t.type(err, 'Error', 'socket.close is rejected: ' + err)
    t.end()
  })
})
