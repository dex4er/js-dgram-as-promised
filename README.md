## dgram-as-promised

[![Build Status](https://secure.travis-ci.org/dex4er/js-dgram-as-promised.svg)](http://travis-ci.org/dex4er/js-dgram-as-promised) [![Coverage Status](https://coveralls.io/repos/github/dex4er/js-dgram-as-promised/badge.svg)](https://coveralls.io/github/dex4er/js-dgram-as-promised) [![npm](https://img.shields.io/npm/v/dgram-as-promised.svg?maxAge=2592000)](https://www.npmjs.com/package/dgram-as-promised)

This library provides promisified version of standard `dgram` class. The API is
the same except `bind`, `close` and `send` methods which return `Promise`
object.

### Usage

`dgram-as-promised` can be used like standard `dgram` module:

```js
const dgramAsPromised = require('dgram-as-promised')

const socket = dgramAsPromised.createSocket('udp4')

const membership = '224.0.0.1'
const port = 41234

const message = new Buffer('ABCDEFGH')
```

Method `bind` returns `Promise` object which is fulfilled when `listening` event
is emitted.

```js
var promise = socket.bind()

promise = promise.then(() => {
  socket.setBroadcast(true)
  socket.setMulticastTTL(128)
  socket.addMembership(membership)
})
```

Method `send` returns `Promise` object which is fulfilled when message has been
sent.

```js
promise = promise.then(() => {
  return socket.send(message, 0, message.length, port, membership)
})
```

Method `close` returns `Promise` object which is fulfilled when `close` event
is emitted.

```js
promise = promise.then(() => {
  return socket.close()
})

promise.then(() => {
  console.log('Message has been sent. Socket is closed.')
})
```
