'use strict'

/* global scenario, given, when, then, after */
const t = require('tap')
require('tap-given')(t)
require('chai').should()

const dgramAsPromised = require('../lib/dgram-as-promised')

scenario('Send datagram', function () {
  given('socket', () => {
    this.socket = dgramAsPromised.createSocket('udp4')
    return this.socket
  })

  when('socket is bound', () => {
    return this.socket.bind()
  })

  when('membership is added', () => {
    try {
      this.address = '224.0.0.1'
      this.socket.setBroadcast(true)
      this.socket.setMulticastTTL(128)
      this.socket.addMembership(this.address)
    } catch (e) {
      this.address = '127.0.0.1'
    }
  })

  when('correct message is sent', () => {
    return this.socket.send(new Buffer('ABCDEFGH'), 0, 8, 41234, this.address)
  })

  when('socket is closed', () => {
    return this.socket.close()
  })

  when('I try to close again', () => {
    return this.socket.close()
    .catch(e => {
      this.error = e
    })
  })

  then("can't be closed again", () => {
    this.error.should.be.an('Error')
  })
})

scenario("Can't send datagram", function () {
  given('socket', () => {
    this.socket = dgramAsPromised.createSocket('udp4')
    return this.socket
  })

  when('socket is bound', () => {
    return this.socket.bind()
  })

  when('membership is added', () => {
    try {
      this.address = '224.0.0.1'
      this.socket.setBroadcast(true)
      this.socket.setMulticastTTL(128)
      this.socket.addMembership(this.address)
    } catch (e) {
      this.address = '127.0.0.1'
    }
  })

  when('wrong message is sent', () => {
    return this.socket.send('', 0, 0, null, null)
    .catch(e => {
      this.error = e
    })
  })

  then("can't be sent", () => {
    this.error.should.be.an('Error')
  })

  after('close the socket', () => {
    return this.socket.close()
    .catch(e => {})
  })
})
