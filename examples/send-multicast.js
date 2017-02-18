'use strict'

const dgramAsPromised = require('dgram-as-promised')

const socket = dgramAsPromised.createSocket('udp4')

const MEMBERSHIP = '224.0.0.1'
const PORT = 41234

const message = new Buffer('ABCDEFGH')

async function main () {
  await socket.bind()
  console.log('Socket is listening')

  socket.setBroadcast(true)
  socket.setMulticastTTL(128)

  socket.addMembership(MEMBERSHIP)
  console.log('Membership is set')

  await socket.send(message, 0, message.length, PORT, MEMBERSHIP)
  console.log('Message is sent')

  await socket.close()
  console.log('Socket is closed')
}

main()
