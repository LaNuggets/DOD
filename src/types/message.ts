export interface Content {
    type: string,
    value: string,
}

export interface Message {
    channel_id: number,
    timestamp: Date,
    author: string,
    content: Content
};
