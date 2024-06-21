/// <reference types="node" />

import * as dgram from "node:dgram"
import type {BindOptions, RemoteInfo, Socket, SocketOptions} from "node:dgram"
import type {AddressInfo} from "node:net"

export interface IncomingPacket {
  msg: Buffer
  rinfo: RemoteInfo
}

export interface SocketAsPromisedOptions extends SocketOptions {
  dgram?: typeof dgram
}

export class SocketAsPromised implements AsyncIterable<IncomingPacket> {
  _closed?: boolean
  _errored?: Error

  constructor(public readonly socket: Socket) {
    socket.on("close", this.closeHandler)
    socket.on("error", this.errorHandler)
  }

  bind(port?: number, address?: string): Promise<AddressInfo>
  bind(options: BindOptions): Promise<AddressInfo>

  bind(arg1?: any, arg2?: any): Promise<AddressInfo> {
    const socket = this.socket

    return new Promise((resolve, reject) => {
      if (this._errored) {
        const err = this._errored
        this._errored = undefined
        return reject(err)
      }

      const errorHandler = (err: Error) => {
        removeListeners()
        reject(err)
      }

      const listeningHandler = () => {
        const address = socket.address() as AddressInfo
        removeListeners()
        resolve(address)
      }

      const removeListeners = () => {
        socket.removeListener("error", errorHandler)
        socket.removeListener("listening", listeningHandler)
      }

      socket.on("error", errorHandler)
      socket.on("listening", listeningHandler)

      try {
        socket.bind(arg1, arg2)
      } catch (e) {
        removeListeners()
        reject(e)
      }
    })
  }

  addMembership(multicastAddress: string, multicastInterface?: string): this {
    this.socket.addMembership(multicastAddress, multicastInterface)
    return this
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._errored) {
        const err = this._errored
        this._errored = undefined
        return reject(err)
      }

      try {
        this.socket.once("close", () => {
          resolve()
        })
        this.socket.close()
      } catch (err) {
        reject(err)
      }
    })
  }

  send(msg: Buffer | string | Uint8Array | any[], port: number, address: string): Promise<number>
  send(
    msg: Buffer | string | Uint8Array,
    offset: number,
    length: number,
    port: number,
    address: string,
  ): Promise<number>

  send(arg1: any, arg2: any, arg3: any, arg4?: any, arg5?: any): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this._errored) {
        const err = this._errored
        this._errored = undefined
        return reject(err)
      }

      try {
        if (arg4 !== undefined) {
          this.socket.send(arg1, arg2, arg3, arg4, arg5, (err, sent) => {
            if (err) {
              reject(err)
            } else {
              resolve(sent)
            }
          })
        } else {
          this.socket.send(arg1, arg2, arg3, (err, sent) => {
            if (err) {
              reject(err)
            } else {
              resolve(sent)
            }
          })
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  recv(): Promise<IncomingPacket | undefined> {
    const socket = this.socket

    return new Promise((resolve, reject) => {
      if (this._errored) {
        const err = this._errored
        this._errored = undefined
        return reject(err)
      }

      if (this._closed) {
        this._closed = undefined
        return resolve(undefined)
      }

      const closeHandler = () => {
        removeListeners()
        resolve(undefined)
      }

      const errorHandler = (err: Error) => {
        removeListeners()
        reject(err)
      }

      const messageHandler = (msg: Buffer, rinfo: RemoteInfo) => {
        removeListeners()
        resolve({msg, rinfo})
      }

      const removeListeners = () => {
        socket.removeListener("close", closeHandler)
        socket.removeListener("error", errorHandler)
        socket.removeListener("message", messageHandler)
      }

      socket.on("close", closeHandler)
      socket.on("error", errorHandler)
      socket.on("message", messageHandler)
    })
  }

  address(): AddressInfo | string {
    return this.socket.address()
  }

  setBroadcast(flag: boolean): this {
    this.socket.setBroadcast(flag)
    return this
  }

  setTTL(ttl: number): this {
    this.socket.setTTL(ttl)
    return this
  }

  setMulticastTTL(ttl: number): this {
    this.socket.setMulticastTTL(ttl)
    return this
  }

  setMulticastInterface(multicastInterface: string): this {
    this.socket.setMulticastInterface(multicastInterface)
    return this
  }

  setMulticastLoopback(flag: boolean): this {
    this.socket.setMulticastLoopback(flag)
    return this
  }

  dropMembership(multicastAddress: string, multicastInterface?: string): this {
    this.socket.dropMembership(multicastAddress, multicastInterface)
    return this
  }

  ref(): this {
    this.socket.ref()
    return this
  }

  unref(): this {
    this.socket.unref()
    return this
  }

  setRecvBufferSize(size: number): this {
    this.socket.setRecvBufferSize(size)
    return this
  }

  setSendBufferSize(size: number): this {
    this.socket.setSendBufferSize(size)
    return this
  }

  getRecvBufferSize(): number {
    return this.socket.getRecvBufferSize()
  }

  getSendBufferSize(): number {
    return this.getSendBufferSize()
  }

  iterate(): AsyncIterableIterator<IncomingPacket> {
    const socketAsPromised = this

    let wasEof = false

    return {
      [Symbol.asyncIterator](): AsyncIterableIterator<IncomingPacket> {
        return this
      },

      async next(): Promise<IteratorResult<IncomingPacket>> {
        if (wasEof) {
          return {value: "", done: true}
        } else {
          const value = await socketAsPromised.recv()
          if (value === undefined) {
            wasEof = true
            return {value: "", done: true}
          } else {
            return {value, done: false}
          }
        }
      },
    }
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<IncomingPacket> {
    return this.iterate()
  }

  destroy(): this {
    const socket = this.socket
    if (socket) {
      socket.removeListener("close", this.closeHandler)
      socket.removeListener("error", this.errorHandler)
    }

    return this
  }

  private readonly closeHandler = (): void => {
    this._closed = true
  }

  private readonly errorHandler = (err: Error): void => {
    this._errored = err
  }
}

export default SocketAsPromised
