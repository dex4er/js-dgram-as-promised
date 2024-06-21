import {expect, use as chaiUse} from "chai"

import chaiAsPromised from "chai-as-promised"
chaiUse(chaiAsPromised)

import dgramAsPromised, {SocketAsPromised} from "../src/dgram-as-promised.js"

import {After, Feature, Given, Scenario, Then, When} from "./lib/steps.js"

import * as mockDgram from "./lib/mock-dgram.js"

Feature("Test dgram-as-promised module for bind method", () => {
  Scenario("Bind socket", () => {
    let socket: SocketAsPromised

    Given("socket", () => {
      socket = dgramAsPromised.createSocket({type: "udp4", dgram: mockDgram as any})
    })

    When("socket is bound", async () => {
      await expect(socket.bind({port: 0})).eventually.to.have.property("address")
    })
  })

  Scenario("Can't bind with rejection", () => {
    let error: Error
    let socket: SocketAsPromised

    Given("socket", () => {
      socket = dgramAsPromised.createSocket({type: "udp4", dgram: mockDgram as any})
    })

    When("bind operation is rejected", async () => {
      await socket.bind({address: "exception"}).catch(err => {
        error = err
      })
    })

    Then("error is occured", () => {
      expect(error).to.be.an("Error")
    })

    After(async () => {
      try {
        await socket.close()
      } catch (_e) {
        // ignore
      }
    })
  })

  Scenario("Can't bind with exception", () => {
    let error: Error
    let socket: SocketAsPromised

    Given("socket", () => {
      socket = dgramAsPromised.createSocket({type: "udp4", dgram: mockDgram as any})
    })

    When("bind operation throws exception", async () => {
      await socket.bind({address: "exception"}).catch(err => {
        error = err
      })
    })

    Then("error is occured", () => {
      expect(error).to.be.an("Error")
    })

    After(async () => {
      try {
        await socket.close()
      } catch (_e) {
        // ignore
      }
    })
  })
})
