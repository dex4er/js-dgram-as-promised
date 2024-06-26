/// <reference types="node" />

import * as dgram from "node:dgram"
import type {RemoteInfo, SocketType} from "node:dgram"
import {SocketAsPromised} from "./socket-as-promised.js"
export {TimeoutError} from "./timeout-error.js"
import type {SocketAsPromisedOptions} from "./socket-as-promised.js"

export type {BindOptions, RemoteInfo, Socket, SocketOptions, SocketType} from "node:dgram"
export type {AddressInfo} from "node:net"
export type {IncomingPacket, SocketAsPromised, SocketAsPromisedOptions} from "./socket-as-promised.js"

export class DgramAsPromised {
  static createSocket(type: SocketType, callback?: (msg: Buffer, rinfo: RemoteInfo) => void): SocketAsPromised
  static createSocket(
    options: SocketAsPromisedOptions,
    callback?: (msg: Buffer, rinfo: RemoteInfo) => void,
  ): SocketAsPromised

  static createSocket(
    options: SocketType | SocketAsPromisedOptions,
    callback?: (msg: Buffer, rinfo: RemoteInfo) => void,
  ): SocketAsPromised {
    if (typeof options === "string") {
      options = {
        type: options,
      }
    }
    const dgramModule = options.dgram || dgram
    return new SocketAsPromised(dgramModule.createSocket(options, callback))
  }
}

export default DgramAsPromised
