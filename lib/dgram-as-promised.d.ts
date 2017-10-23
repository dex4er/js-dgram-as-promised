import { AddressInfo, BindOptions, RemoteInfo, Socket, SocketOptions, SocketType } from 'dgram'

export class SocketAsPromised {
  socket: Socket

  constructor (socket: Socket)

  bind (port?: number, address?: string): Promise<AddressInfo>
  bind (options: BindOptions): Promise<AddressInfo>

  addMembership (multicastAddress: string, multicastInterface?: string): void

  close (): Promise<void>

  send (msg: Buffer | String | any[], offset: number, length: number, port: number, address: string): Promise<number>
  send (msg: Buffer | String | any[], port: number, address: string): Promise<number>

  setBroadcast (flag: boolean): void
  setMulticastTTL (ttl: number): void
}

export function createSocket (type: SocketType, callback?: (msg: Buffer, rinfo: RemoteInfo) => void): SocketAsPromised;
export function createSocket (options: SocketOptions, callback?: (msg: Buffer, rinfo: RemoteInfo) => void): SocketAsPromised;
