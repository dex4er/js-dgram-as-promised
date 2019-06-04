# dgram-as-promised

<!-- markdownlint-disable MD013 -->

[![Build Status](https://secure.travis-ci.org/dex4er/js-dgram-as-promised.svg)](http://travis-ci.org/dex4er/js-dgram-as-promised) [![Coverage Status](https://coveralls.io/repos/github/dex4er/js-dgram-as-promised/badge.svg)](https://coveralls.io/github/dex4er/js-dgram-as-promised) [![npm](https://img.shields.io/npm/v/dgram-as-promised.svg)](https://www.npmjs.com/package/dgram-as-promised)

<!-- markdownlint-enable MD013 -->

This module provides promisified version of standard
[dgram](https://nodejs.org/api/dgram.html) class. The API is
the same as for standard `dgram`, except `bind`, `close` and `send` methods
which return
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
object.

## Requirements

This module requires ES6 with Node >= 6.

## Installation

```shell
npm install dgram-as-promised
```

_Additionally for Typescript:_

```shell
npm install -D @types/node
```

## Usage

`dgram-as-promised` can be used similar to standard `dgram` module.

_Example:_

```js
const {DgramAsPromised} = require("dgram-as-promised")

const socket = DgramAsPromised.createSocket("udp4")

const MEMBERSHIP = "224.0.0.1"
const PORT = 41234

const message = Buffer.from("ABCDEFGH")
```

_Typescript:_

```ts
import DgramAsPromised from "dgram-as-promised"
// or
import {DgramAsPromised} from "dgram-as-promised"

const socket = DgramAsPromised.createSocket("udp4")
```

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

Method `send` returns `Promise` object which is fulfilled when message has been
sent.

```js
const bytes = await socket.send(message, 0, message.length, PORT, MEMBERSHIP)
console.log(`Message is sent (${bytes} bytes)`)
```

Method `close` returns `Promise` object which resolves to number of bytes sent
when `close` event is emitted.

```js
await socket.close()
console.log("Socket is closed")
```

## License

Copyright (c) 2016-2019 Piotr Roszatycki <mailto:piotr.roszatycki@gmail.com>

[MIT](https://opensource.org/licenses/MIT)
