'use strict'

const t = require('tap')
require('tap-given')(t)

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.should()
chai.use(chaiAsPromised)

const dgramAsPromised = require('../lib/dgram-as-promised')

Feature('Test dgram-as-promised module', () => {
  Scenario('Send datagram', () => {
    let address
    let promise
    let socket

    Given('socket', () => {
      socket = dgramAsPromised.createSocket('udp4')
    })

    When('socket is bound', () => {
      return socket.bind().should.be.fulfilled
    })

    And('membership is added', () => {
      try {
        address = '224.0.0.1'
        socket.setBroadcast(true)
        socket.setMulticastTTL(128)
        socket.addMembership(address)
      } catch (e) {
        address = '127.0.0.1'
      }
    })

    And('correct message is sent', () => {
      return socket.send(Buffer.from('ABCDEFGH'), 0, 8, 41234, address).should.be.fulfilled
    })

    And('socket is closed', () => {
      return socket.close().should.be.fulfilled
    })

    And('I try to close again', () => {
      promise = socket.close()
    })

    Then("can't be closed again", () => {
      return promise.should.be.rejected
    })
  })

  Scenario("Can't send datagram", () => {
    let address
    let promise
    let socket

    Given('socket', () => {
      socket = dgramAsPromised.createSocket('udp4')
    })

    When('socket is bound', () => {
      return socket.bind().should.be.fulfilled
    })

    And('membership is added', () => {
      try {
        address = '224.0.0.1'
        socket.setBroadcast(true)
        socket.setMulticastTTL(128)
        socket.addMembership(address)
      } catch (e) {
        address = '127.0.0.1'
      }
    })

    And('wrong message is sent', () => {
      promise = socket.send('', 0, 0, null, null)
    })

    Then("can't be sent", () => {
      return promise.should.be.rejected
    })

    After('close the socket', () => {
      return socket.close()
      .catch(e => {})
    })
  })
})
