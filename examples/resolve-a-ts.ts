#!/usr/bin/env -S node --experimental-specifier-resolution=node --no-warnings --loader ts-node/esm

import * as dnsPacket from "dns-packet"
import * as util from "node:util"

import {DgramAsPromised} from "../src/dgram-as-promised.js"

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const name = process.argv[2] || "google.com"
const type = (process.argv[3] as dnsPacket.RecordType) || "A"
const server = process.argv[4] || "8.8.8.8"

util.inspect.defaultOptions.depth = Infinity

async function main(): Promise<void> {
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
