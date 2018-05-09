/// <reference types="node" />

import { BindOptions, RemoteInfo, Socket, SocketOptions, SocketType } from 'dgram'
import { AddressInfo } from 'net'

export class SocketAsPromised {
  socket: Socket

  constructor (socket: Socket)

  bind (port?: number, address?: string): Promise<AddressInfo>
  bind (options: BindOptions): Promise<AddressInfo>

  addMembership (multicastAddress: string, multicastInterface?: string): void

  close (): Promise<void>

  send (msg: Buffer | String | any[], offset: number, length: number, port: number, address: string): Promise<number>
  send (msg: Buffer | String | any[], port: number, address: string): Promise<number>

  address (): AddressInfo
  setBroadcast (flag: boolean): void
  setTTL (ttl: number): void
  setMulticastTTL (ttl: number): void
  setMulticastInterface (multicastInterface: string): void
  setMulticastLoopback (flag: boolean): void
  addMembership (multicastAddress: string, multicastInterface?: string): void
  dropMembership (multicastAddress: string, multicastInterface?: string): void
  ref(): this
  unref(): this
  setRecvBufferSize(size: number): void
  setSendBufferSize(size: number): void
  getRecvBufferSize(): number
  getSendBufferSize(): number
}

export function createSocket (type: SocketType, callback?: (msg: Buffer, rinfo: RemoteInfo) => void): SocketAsPromised;
export function createSocket (options: SocketOptions, callback?: (msg: Buffer, rinfo: RemoteInfo) => void): SocketAsPromised;
