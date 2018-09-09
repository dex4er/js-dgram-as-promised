import { After, And, Feature, Given, Scenario, Then, When } from './lib/steps'

import dgramAsPromised, { SocketAsPromised } from '../src/dgram-as-promised'

import mockDgram from './lib/mock-dgram'

Feature('Test dgram-as-promised module', () => {
  Scenario('Send datagram', () => {
    let address: string
    let error: Error
    let socket: SocketAsPromised

    Given('socket', () => {
      socket = dgramAsPromised.createSocket({ type: 'udp4', dgram: mockDgram as any })
    })

    When('socket is bound', () => {
      return socket.bind({ port: 0 }).should.eventually.have.property('address')
    })

    And('membership is added', () => {
      address = '224.0.0.1'
      socket.setBroadcast(true)
      socket.setMulticastTTL(128)
      socket.addMembership(address)
    })

    And('correct message is sent', async () => {
      await socket.send(Buffer.from('ABCDEFGH'), 0, 8, 41234, address).should.eventually.be.equal(8)
    })

    And('socket is closed', async () => {
      await socket.close().should.be.fulfilled
    })

    And('I try to close again', async () => {
      try {
        await socket.close()
      } catch (e) {
        error = e
      }
    })

    Then("can't be closed again", () => {
      return error.should.be.an('Error')
    })
  })

  Scenario("Can't send datagram", () => {
    let address: string
    let error: Error
    let socket: SocketAsPromised

    Given('socket', () => {
      socket = dgramAsPromised.createSocket({ type: 'udp4', dgram: mockDgram as any })
    })

    When('socket is bound', async () => {
      await socket.bind().should.eventually.have.property('address')
    })

    And('membership is added', () => {
      address = '224.0.0.1'
      socket.setBroadcast(true)
      socket.setMulticastTTL(128)
      socket.addMembership(address)
    })

    And('wrong message is sent', async () => {
      try {
        await socket.send('', 0, 0, 0, '')
      } catch (e) {
        error = e
      }
    })

    Then("can't be sent", () => {
      return error.should.be.an('Error')
    })

    After(async () => {
      try {
        await socket.close()
      } catch (e) {
        // ignore
      }
    })
  })
})
