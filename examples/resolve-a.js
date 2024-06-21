#!/usr/bin/env node

import * as dnsPacket from "dns-packet"
import * as util from "node:util"

import {DgramAsPromised} from "../lib/dgram-as-promised.js"

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const name = process.argv[2] || "google.com"
const type = process.argv[3] || "A"
const server = process.argv[4] || "8.8.8.8"

util.inspect.defaultOptions.depth = Infinity

async function main() {
  const socket = DgramAsPromised.createSocket("udp4")

  const buf = dnsPacket.encode({
    type: "query",
    id: getRandomInt(1, 65534),
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [
      {
        type,
        name,
      },
    ],
  })

  await socket.send(buf, 0, buf.length, 53, server)

  const packet = await socket.recv()
  if (packet) {
    const msg = dnsPacket.decode(packet.msg)
    console.info({
      rinfo: packet.rinfo,
      msg,
    })
    await socket.close()
  }

  socket.destroy()
}

main().catch(console.error)
