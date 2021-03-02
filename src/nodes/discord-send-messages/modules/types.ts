import { Node, NodeDef } from 'node-red';
import { DiscordSendMessagesOptions } from '../shared/types';
import { Stream } from 'stream';
import { ColorResolvable } from 'discord.js';

export interface DiscordSendMessagesNodeDef
  extends NodeDef,
    DiscordSendMessagesOptions {}

// export interface DiscordSendMessagesNode extends Node {}
export type DiscordSendMessagesNode = Node;

export interface NodeFlowMessage {
  channel?: string;
  payload: string;
  rich?: RichEmbedArgs;
  attachments?: NodeFlowAttachment[];
}

export interface NodeFlowAttachment {
  name: string;
  src: string | Buffer | Stream;
}

interface RichEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface RichEmbedArgs {
  title?: string;
  description?: string;
  url?: string;
  color?: ColorResolvable;
  timestamp?: number | Date;
  footer?: {
    icon?: string;
    text: string;
  };
  thumbnail?: string;
  author: {
    name: string;
    icon?: string;
    url?: string;
  };

  attachments?: NodeFlowAttachment[];
  field?: RichEmbedField;
  fields?: RichEmbedField[];
}
