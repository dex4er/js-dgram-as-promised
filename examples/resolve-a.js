const dnsPacket = require("dns-packet-typescript")

const {DgramAsPromised} = require("../lib/dgram-as-promised")

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const name = process.argv[2] || "google.com"
const server = process.argv[3] || "8.8.8.8"

async function main() {
  const socket = DgramAsPromised.createSocket("udp4")

  const buf = dnsPacket.encode({
    type: "query",
    id: getRandomInt(1, 65534),
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [
      {
        type: "A",
        name,
      },
    ],
  })

  await socket.send(buf, 0, buf.length, 53, server)

  const packet = await socket.recv()
  if (packet) {
    console.info({
      rinfo: packet.rinfo,
      msg: dnsPacket.decode(packet.msg),
    })
    await socket.close()
  }

  socket.destroy()
}

main().catch(console.error)
