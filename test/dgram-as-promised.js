'use strict'

const t = require('tap')
const dgramAsPromised = require('../lib/dgram-as-promised')

var TIMEOUT = 10000

t.plan(2)

t.test('Send datagram', {timeout: TIMEOUT}, t => {
  t.plan(5)

  const socket = dgramAsPromised.createSocket('udp4')

  const promise = socket.bind()
  promise.then(() => {
    t.pass('socket.bind is fulfilled')
    let address = '224.0.0.1'
    try {
      socket.setBroadcast(true)
      socket.setMulticastTTL(128)
      socket.addMembership(address)
    } catch (err) {
      address = '127.0.0.1'
    }
    return socket.send(new Buffer('ABCDEFGH'), 0, 8, 41234, address)
  }).then(() => {
    t.pass('socket.send is fulfilled')
    return socket.send('', 0, 0, null, null)
  }).catch(function (err) {
    t.type(err, 'Error', 'socket.send is rejected: ' + err)
    return socket.close()
  }).then(() => {
    t.pass('socket.close is fulfilled')
    return socket.close()
  }).catch(function (err) {
    t.type(err, 'Error', 'socket.close is rejected: ' + err)
    t.end()
  })
})

t.test('createSocket with callback for message signal', {timeout: TIMEOUT}, t => {
  t.plan(2)

  const socket = dgramAsPromised.createSocket('udp4', (msg, rinfo) => {
    t.pass('message signal received')
    t.equals(msg, 'It-s-a-me', 'message is correct')
  })

  const promise = socket.bind()
  promise.then(() => {
    t.pass('socket.bind is fulfilled')
  })
})
