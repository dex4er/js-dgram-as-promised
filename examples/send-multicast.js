'use strict'

const dgramAsPromised = require('dgram-as-promised')

const socket = dgramAsPromised.createSocket('udp4')

const membership = '224.0.0.1'
const port = 41234

const message = new Buffer('ABCDEFGH')

socket.bind().then(() => {
  console.log('Socket is listening')
  socket.setBroadcast(true)
  socket.setMulticastTTL(128)
  socket.addMembership(membership)
}).then(() => {
  console.log('Membership is set')
  return socket.send(message, 0, message.length, port, membership)
}).then(() => {
  console.log('Message is sent')
  return socket.close()
}).then(() => {
  console.log('Socket is closed')
})
