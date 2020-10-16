/// <reference types="node" />

import * as dgram from "dgram"
import type {RemoteInfo, SocketType} from "dgram"
import {SocketAsPromised} from "./socket-as-promised"
import type {SocketAsPromisedOptions} from "./socket-as-promised"

export type {BindOptions, RemoteInfo, Socket, SocketOptions, SocketType} from "dgram"
export type {AddressInfo} from "net"
export type {IncomingPacket, SocketAsPromised, SocketAsPromisedOptions} from "./socket-as-promised"

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
