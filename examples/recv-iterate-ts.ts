#!/usr/bin/env -S node --experimental-specifier-resolution=node --no-warnings --loader ts-node/esm

import {DgramAsPromised} from "../src/dgram-as-promised.js"

const port = Number(process.argv[2]) || 0

async function main(): Promise<void> {
  const socket = DgramAsPromised.createSocket("udp4")

  const address = await socket.bind({port})
  console.info(`Socket is listening on ${address.address}:${address.port}`)
  socket.setTimeout(5000)

  try {
    for await (const packet of socket) {
      console.log(packet)
      if (packet.msg.indexOf(4) !== -1) {
        await socket.close()
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    await socket.close()
    socket.destroy()
  }
}

main().catch(console.error)
