import chai, {expect} from "chai"

import chaiAsPromised from "chai-as-promised"
chai.use(chaiAsPromised)

import dgramAsPromised, {SocketAsPromised} from "../src/dgram-as-promised"

import {After, And, Feature, Given, Scenario, Then, When} from "./lib/steps"

import mockDgram from "./lib/mock-dgram"

Feature("Test dgram-as-promised module for send method", () => {
  Scenario("Send datagram", () => {
    let address: string
    let error: Error
    let socket: SocketAsPromised

    Given("socket", () => {
      socket = dgramAsPromised.createSocket({type: "udp4", dgram: mockDgram as any})
    })

    When("socket is bound", async () => {
      await expect(socket.bind({port: 0})).eventually.to.have.property("address")
    })

    And("membership is added", () => {
      address = "224.0.0.1"
      socket.setBroadcast(true)
      socket.setMulticastTTL(128)
      socket.addMembership(address)
    })

    And("correct message is sent", async () => {
      await expect(socket.send(Buffer.from("ABCDEFGH"), 0, 8, 41234, address)).eventually.to.be.equal(8)
    })

    And("socket is closed", async () => {
      await expect(socket.close()).to.be.fulfilled
    })

    And("I try to close again", async () => {
      try {
        await socket.close()
      } catch (e) {
        error = e
      }
    })

    Then("can't be closed again", () => {
      expect(error).to.be.an("Error")
    })
  })

  Scenario("Can't send datagram", () => {
    let address: string
    let error: Error
    let socket: SocketAsPromised

    Given("socket", () => {
      socket = dgramAsPromised.createSocket({type: "udp4", dgram: mockDgram as any})
    })

    When("socket is bound", async () => {
      await expect(socket.bind()).eventually.to.have.property("address")
    })

    And("membership is added", () => {
      address = "224.0.0.1"
      socket.setBroadcast(true)
      socket.setMulticastTTL(128)
      socket.addMembership(address)
    })

    And("wrong message is sent", async () => {
      try {
        await socket.send("", 0, 0, 0, "")
      } catch (e) {
        error = e
      }
    })

    Then("can't be sent", () => {
      expect(error).to.be.an("Error")
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
