export interface Channel {
  id: number
  name: string | null
  img?: string | null
  creator: string
  theme?: Theme | null
  users: string[]
}

export interface Theme {
  primary_color: string
  primary_color_dark: string
  accent_color: string
  text_color: string
  accent_text_color: string
}

export interface ChannelMetaData {
  name: string
  img?: string
}

export interface ChannelNewMetaData {
  name: string | null
  img: string | null
  theme: Theme
}

// API return channel id
export type CreateChannelResponse = number
