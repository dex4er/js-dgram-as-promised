/// <reference types="node" />

import * as dgram from "dgram"
import type {BindOptions, RemoteInfo, Socket, SocketOptions} from "dgram"
import type {AddressInfo} from "net"

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

  addMembership(multicastAddress: string, multicastInterface?: string): void {
    return this.socket.addMembership(multicastAddress, multicastInterface)
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

  setBroadcast(flag: boolean): void {
    this.socket.setBroadcast(flag)
  }

  setTTL(ttl: number): void {
    return this.socket.setTTL(ttl)
  }

  setMulticastTTL(ttl: number): void {
    this.socket.setMulticastTTL(ttl)
  }

  setMulticastInterface(multicastInterface: string): void {
    this.socket.setMulticastInterface(multicastInterface)
  }

  setMulticastLoopback(flag: boolean): void {
    this.socket.setMulticastLoopback(flag)
  }

  dropMembership(multicastAddress: string, multicastInterface?: string): void {
    this.socket.dropMembership(multicastAddress, multicastInterface)
  }

  ref(): this {
    this.socket.ref()
    return this
  }

  unref(): this {
    this.socket.unref()
    return this
  }

  setRecvBufferSize(size: number): void {
    this.socket.setRecvBufferSize(size)
  }

  setSendBufferSize(size: number): void {
    this.socket.setSendBufferSize(size)
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

  destroy(): void {
    const socket = this.socket
    if (socket) {
      socket.removeListener("close", this.closeHandler)
      socket.removeListener("error", this.errorHandler)
    }
  }

  private readonly closeHandler = (): void => {
    this._closed = true
  }

  private readonly errorHandler = (err: Error): void => {
    this._errored = err
  }
}

export default SocketAsPromised
