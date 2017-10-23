import * as dgramAsPromised from '../lib/dgram-as-promised'

const MEMBERSHIP = '224.0.0.1'
const PORT = 41234

const message = Buffer.from('ABCDEFGH')

async function main () {
  const socket = dgramAsPromised.createSocket('udp4')

  const address = await socket.bind()
  console.info(`Socket is listening on ${address.address}:${address.port}`)

  socket.setBroadcast(true)
  socket.setMulticastTTL(128)

  socket.addMembership(MEMBERSHIP)
  console.info('Membership is set')

  const sent = await socket.send(message, 0, message.length, PORT, MEMBERSHIP)
  console.info(`Message is sent (${sent} bytes)`)

  await socket.close()
  console.info('Socket is closed')
}

main().catch(console.error)
