import chai, {expect} from "chai"

import chaiAsPromised from "chai-as-promised"
chai.use(chaiAsPromised)

import dirtyChai from "dirty-chai"
chai.use(dirtyChai)

import dgramAsPromised, {IncomingPacket, SocketAsPromised} from "../src/dgram-as-promised"

import {And, Feature, Given, Scenario, Then, When} from "./lib/steps"

import mockDgram from "./lib/mock-dgram"

Feature("Test dgram-as-promised module for iterate method", () => {
  Scenario("Iterate on datagrams", () => {
    let iterator: AsyncIterableIterator<IncomingPacket>
    let packet: IncomingPacket
    let result: IteratorResult<IncomingPacket>
    let socket: SocketAsPromised

    Given("socket", () => {
      socket = dgramAsPromised.createSocket({type: "udp4", dgram: mockDgram as any})
    })

    When("socket is bound", async () => {
      await expect(socket.bind({port: 0})).eventually.to.have.property("address")
    })

    And("I get an iterator", () => {
      iterator = socket.iterate()
    })

    And("I wait for next result from iterator", () => {
      iterator.next().then(arg => (result = arg))
    })

    And("message event is emitted", async () => {
      socket.socket.emit("message", Buffer.from("ABCDEFGH"), {
        address: "127.0.0.1",
        family: "IPv4",
        port: 1234,
        size: 8,
      })
    })

    Then("iterator is not done", () => {
      expect(result.done).to.be.false()
    })

    And("iterator returns packet", () => {
      packet = result.value
      expect(packet).to.be.ok()
      expect(packet).to.have.property("msg")
      expect(packet).to.have.property("rinfo")
    })

    And("message is correct", async () => {
      expect(packet.msg.toString()).to.equal("ABCDEFGH")
    })

    And("rinfo is correct", async () => {
      expect(packet.rinfo.size).to.equal(8)
    })

    When("I wait for next result from iterator", () => {
      iterator.next().then(arg => (result = arg))
    })

    And("socket is closed", async () => {
      await socket.close()
    })

    Then("iterator is done", () => {
      expect(result.done).to.be.true()
    })
  })
})
