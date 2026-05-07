export type ChannelType =
  | "facebook"
  | "line"

export interface Channel {
  id: string

  type: ChannelType

  name: string
  code?: string

  talk: number
  noTalk: number
  ghost: number

  buyCount: number
  buyAmount: number

  follow: number
  call: number

  reCount: number
  reAmount: number

  comeback: number

  sales: number
}