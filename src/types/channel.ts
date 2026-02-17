export interface Channel {
  id: number
  name: string | null
  img?: string | null
  creator: string 
  theme?: object | null
  users: string[]
}

export interface ChannelNewMetaData {
  name: string | null;
  img: string | null;
  theme: Record<string, any>;
}


export interface CreateChannelResponse {
  id: string
  name: string
  img?: string
}
