# dgram-as-promised

<!-- markdownlint-disable MD013 -->

[![GitHub](https://img.shields.io/github/v/release/dex4er/js-dgram-as-promised?display_name=tag&sort=semver)](https://github.com/dex4er/js-dgram-as-promised)
[![CI](https://github.com/dex4er/js-dgram-as-promised/actions/workflows/ci.yaml/badge.svg)](https://github.com/dex4er/js-dgram-as-promised/actions/workflows/ci.yaml)
[![Trunk Check](https://github.com/dex4er/js-dgram-as-promised/actions/workflows/trunk.yaml/badge.svg)](https://github.com/dex4er/js-dgram-as-promised/actions/workflows/trunk.yaml)
[![Coverage Status](https://coveralls.io/repos/github/dex4er/js-dgram-as-promised/badge.svg)](https://coveralls.io/github/dex4er/js-dgram-as-promised)
[![npm](https://img.shields.io/npm/v/dgram-as-promised.svg)](https://www.npmjs.com/package/dgram-as-promised)

<!-- markdownlint-enable MD013 -->

This module provides promisified version of the standard
[dgram](https://nodejs.org/api/dgram.html) class. The API is the same as for
standard `dgram`, except `bind`, `close` and `send` methods which return
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
object.

## Requirements

This module requires ES2021 with Node >= 16.

## Installation

```shell
npm install dgram-as-promised
```

_Additionally for Typescript:_

```shell
npm install -D @types/node
```

## Usage

`dgram-as-promised` can be used similarly to the standard `dgram` module.

_Example:_

```js
import DgramAsPromised from "dgram-as-promised"

const socket = DgramAsPromised.createSocket("udp4")

const MEMBERSHIP = "224.0.0.1"
const PORT = 41234

const message = Buffer.from("ABCDEFGH")
```

### bind

Method `bind` returns `Promise` object which resolves to address info when
`listening` event is emitted.

```js
const address = await socket.bind()
console.log(`Socket is listening on ${address.address}:${address.port}`)

socket.setBroadcast(true)
socket.setMulticastTTL(128)

socket.addMembership(MEMBERSHIP)
console.log("Membership is set")
```

### send

Method `send` returns `Promise` object which is fulfilled when the message
has been sent.

```js
const bytes = await socket.send(message, 0, message.length, PORT, MEMBERSHIP)
console.log(`Message is sent (${bytes} bytes)`)
```

### recv

Method `recv` returns `Promise` object which resolves to the object with `msg`
and `rinfo` properties as from `message` event or resolves to `undefined` when
the socket is already closed.

```js
const packet = await socket.recv()
if (packet) {
  console.log(`Received message: ${packet.msg.toString()}`)
  console.log(`Received ${packet.rinfo.size} bytes`)
}
```

### close

Method `close` returns `Promise` object which resolves when `close` event is
emitted.

```js
await socket.close()
console.log("Socket is closed")
```

### iterate

Method `iterate` and the socket object return an asynchronous iterator which
will call `recv` method until the socket is closed.

```js
for await (const packet of socket) {
  console.info(packet.msg.toString())
  // Close socket if Ctrl-D is in the message
  if (packet.msg.indexOf(4) !== -1) {
    await socket.close()
  }
}
```

### destroy

Method `destroy` cleans internal listeners.

```js
socket = socket.destroy()
```

The method returns this object.

## License

Copyright (c) 2016-2024 Piotr Roszatycki <mailto:piotr.roszatycki@gmail.com>

[MIT](https://opensource.org/licenses/MIT)
