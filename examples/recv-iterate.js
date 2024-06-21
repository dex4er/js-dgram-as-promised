#!/usr/bin/env node

import wtf from "wtfnode"

import {DgramAsPromised} from "../lib/dgram-as-promised.js"

const port = Number(process.argv[2]) || 0

async function main() {
  const socket = DgramAsPromised.createSocket("udp6")

  const address = await socket.bind({port, address: "::1"})
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
  }
  wtf.dump()
}

main().catch(console.error)
