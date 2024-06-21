import {BindOptions, RemoteInfo, SocketOptions} from "node:dgram"
import {EventEmitter} from "node:events"
import {AddressInfo} from "node:net"

export class Socket extends EventEmitter {
  _closed = false

  constructor() {
    super()
  }

  addMembership(_multicastAddress: string, _multicastInterface?: string): void {
    // nothing
  }

  address(): AddressInfo {
    return {
      address: "127.0.0.1",
      port: 12345,
      family: "udp4",
    }
  }

  bind(port?: number, callback?: () => void): void
  bind(callback?: () => void): void
  bind(options: BindOptions, callback?: () => void): void

  bind(options?: any, callback?: () => void): void {
    if (typeof options === "object" && options.address === "rejection") {
      this.emit("error", new Error(options))
      return
    }
    if (typeof options === "object" && options.address === "exception") {
      throw new Error(options)
    }
    if (typeof options === "function") {
      callback = options
    }
    if (callback) {
      this.on("listening", callback)
    }
    this.emit("listening")
  }

  close(callback?: () => void): void {
    if (this._closed) {
      throw new Error("already closed")
    } else {
      this.emit("close")
      this._closed = true
    }
    if (callback) {
      callback()
    }
  }

  send(
    msg: Buffer | string | Uint8Array,
    _offset: number,
    length: number,
    _port: number,
    _address?: string,
    callback?: (error: Error | null, bytes: number) => void,
  ): void {
    if (!msg) {
      throw new Error("wrong message")
    } else {
      if (callback) {
        callback(null, length)
      }
    }
  }

  setBroadcast(_flag: boolean): void {
    // nothing
  }

  setMulticastTTL(_ttl: number): void {
    // nothing
  }
}

export function createSocket(_options: SocketOptions, _callback?: (msg: Buffer, rinfo: RemoteInfo) => void): Socket {
  return new Socket()
}
