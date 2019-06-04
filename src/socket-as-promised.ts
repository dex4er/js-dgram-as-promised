/// <reference types="node" />

import dgram, {BindOptions, Socket, SocketOptions} from "dgram"
import {AddressInfo} from "net"

export interface SocketAsPromisedOptions extends SocketOptions {
  dgram?: typeof dgram
}

export class SocketAsPromised {
  constructor(public readonly socket: Socket) {}

  bind(port?: number, address?: string): Promise<AddressInfo>
  bind(options: BindOptions): Promise<AddressInfo>

  bind(arg1?: any, arg2?: any): Promise<AddressInfo> {
    return new Promise(resolve => {
      if (arg2 !== undefined) {
        this.socket.bind(arg1, arg2, () => {
          const address = this.socket.address() as AddressInfo
          resolve(address)
        })
      } else {
        this.socket.bind(arg1, () => {
          const address = this.socket.address() as AddressInfo
          resolve(address)
        })
      }
    })
  }

  addMembership(multicastAddress: string, multicastInterface?: string): void {
    return this.socket.addMembership(multicastAddress, multicastInterface)
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
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
}

export default SocketAsPromised
