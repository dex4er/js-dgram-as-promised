/// <reference types="node" />

import dgram, {RemoteInfo, SocketType} from "dgram"
import {SocketAsPromised, SocketAsPromisedOptions} from "./socket-as-promised"

export {BindOptions, RemoteInfo, Socket, SocketOptions, SocketType} from "dgram"
export {AddressInfo} from "net"
export {SocketAsPromised, SocketAsPromisedOptions} from "./socket-as-promised"

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
