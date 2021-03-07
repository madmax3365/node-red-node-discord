import { Node, NodeDef, NodeMessageInFlow } from 'node-red';
import { DiscordSendMessagesOptions } from '../shared/types';
import { Stream } from 'stream';
import { ColorResolvable } from 'discord.js';
import { DiscordMessageEmbed } from './DiscordMessageEmbed';

export interface DiscordSendMessagesNodeDef
  extends NodeDef,
    DiscordSendMessagesOptions {}

// export interface DiscordSendMessagesNode extends Node {}
export type DiscordSendMessagesNode = Node;

export type EmbedType =
  | 'rich'
  | 'image'
  | 'video'
  | 'gifv'
  | 'article'
  | 'link';

export interface NodeFlowMessage extends NodeMessageInFlow {
  dm?: string | string[];
  channel?: string | string[];
  msg?: string;
  embed?: RichEmbedArgs;
  attachments?: NodeFlowAttachment[];
}

export interface NodeFlowAttachment {
  name: string;
  attachment: string | Buffer | Stream;
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
  type: EmbedType;
  color?: ColorResolvable;
  timestamp?: number | Date;
  footer?: {
    icon?: string;
    text: string;
  };
  provider?: {
    name: string;
    url: string;
  };
  thumbnail?: string;
  author?: {
    name: string;
    url?: string;
    iconUrl?: string;
  };

  attachments?: NodeFlowAttachment[];
  field?: RichEmbedField;
  fields?: RichEmbedField[];
}

export interface MessageFilesArg {
  files: NodeFlowAttachment[];
}

export interface FormattedMessageArgs {
  content: string | DiscordMessageEmbed | MessageFilesArg;
  additions: DiscordMessageEmbed | MessageFilesArg;
}
