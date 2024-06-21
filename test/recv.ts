import {expect, use as chaiUse} from "chai"

import chaiAsPromised from "chai-as-promised"
chaiUse(chaiAsPromised)

import dgramAsPromised, {IncomingPacket, SocketAsPromised} from "../src/dgram-as-promised.js"

import {And, Feature, Given, Scenario, Then, When} from "./lib/steps.js"

import * as mockDgram from "./lib/mock-dgram.js"

Feature("Test dgram-as-promised module for recv method", () => {
  Scenario("Receive datagram", () => {
    let packet: IncomingPacket | undefined
    let socket: SocketAsPromised

    Given("socket", () => {
      socket = dgramAsPromised.createSocket({type: "udp4", dgram: mockDgram as any})
    })

    When("socket is bound", async () => {
      await expect(socket.bind({port: 0})).eventually.to.have.property("address")
    })

    And("waits for packet", () => {
      socket.recv().then(arg => (packet = arg))
    })

    And("message event is emitted", async () => {
      socket.socket.emit("message", Buffer.from("ABCDEFGH"), {
        address: "127.0.0.1",
        family: "IPv4",
        port: 1234,
        size: 8,
      })
    })

    Then("packet is received", async () => {
      expect(packet).to.have.property("msg")
      expect(packet).to.have.property("rinfo")
    })

    And("message is correct", async () => {
      expect(packet!.msg.toString()).to.equal("ABCDEFGH")
    })

    And("rinfo is correct", async () => {
      expect(packet!.rinfo.size).to.equal(8)
    })
  })

  Scenario("Can't receive datagram with rejection", () => {
    let error: Error
    let socket: SocketAsPromised

    Given("socket", () => {
      socket = dgramAsPromised.createSocket({type: "udp4", dgram: mockDgram as any})
    })

    When("socket is bound", async () => {
      await expect(socket.bind({port: 0})).eventually.to.have.property("address")
    })

    And("waits for packet", () => {
      socket.recv().catch(err => (error = err))
    })

    And("message event is emitted", async () => {
      socket.socket.emit("error", new Error("rejected"))
    })

    Then("can't be received", () => {
      expect(error).to.be.an("Error")
    })
  })
})
