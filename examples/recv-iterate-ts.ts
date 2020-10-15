import {DgramAsPromised} from "../src/dgram-as-promised"

const port = Number(process.argv[2]) || 0

async function main(): Promise<void> {
  const socket = DgramAsPromised.createSocket("udp4")

  const address = await socket.bind({port})
  console.info(`Socket is listening on ${address.address}:${address.port}`)

  for await (const packet of socket) {
    console.info(packet)
    if (packet.msg.indexOf(4) !== -1) {
      await socket.close()
    }
  }

  socket.destroy()
}

main().catch(console.error)
