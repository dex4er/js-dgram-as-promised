'use strict'

/* global Feature, Scenario, Given, When, Then, After */
const t = require('tap')
require('tap-given')(t)
require('chai').should()

const dgramAsPromised = require('../lib/dgram-as-promised')

Feature('Test dgram-as-promised module', () => {
  Scenario('Send datagram', function () {
    Given('socket', () => {
      this.socket = dgramAsPromised.createSocket('udp4')
      return this.socket
    })

    When('socket is bound', () => {
      return this.socket.bind()
    })

    When('membership is added', () => {
      try {
        this.address = '224.0.0.1'
        this.socket.setBroadcast(true)
        this.socket.setMulticastTTL(128)
        this.socket.addMembership(this.address)
      } catch (e) {
        this.address = '127.0.0.1'
      }
    })

    When('correct message is sent', () => {
      return this.socket.send(new Buffer('ABCDEFGH'), 0, 8, 41234, this.address)
    })

    When('socket is closed', () => {
      return this.socket.close()
    })

    When('I try to close again', () => {
      return this.socket.close()
      .catch(e => {
        this.error = e
      })
    })

    Then("can't be closed again", () => {
      this.error.should.be.an('Error')
    })
  })

  Scenario("Can't send datagram", function () {
    Given('socket', () => {
      this.socket = dgramAsPromised.createSocket('udp4')
      return this.socket
    })

    When('socket is bound', () => {
      return this.socket.bind()
    })

    When('membership is added', () => {
      try {
        this.address = '224.0.0.1'
        this.socket.setBroadcast(true)
        this.socket.setMulticastTTL(128)
        this.socket.addMembership(this.address)
      } catch (e) {
        this.address = '127.0.0.1'
      }
    })

    When('wrong message is sent', () => {
      return this.socket.send('', 0, 0, null, null)
      .catch(e => {
        this.error = e
      })
    })

    Then("can't be sent", () => {
      this.error.should.be.an('Error')
    })

    After('close the socket', () => {
      return this.socket.close()
      .catch(e => {})
    })
  })
})
