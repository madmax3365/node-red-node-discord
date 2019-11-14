import { Stream } from 'stream';

import {
  Attachment,
  Client,
  DMChannel,
  GroupDMChannel,
  GuildMember,
  Message,
  TextChannel,
  User,
} from 'discord.js';
import { Node, NodeProperties } from 'node-red';

export interface IConnectConfig extends Node {
  credentials: {
    token: string;
  };
  token?: string;
}

export interface IGetMessageConfig extends Node {
  token: string;
  channels: string;
}

export interface ISendMessageProps extends NodeProperties {
  token: string;
  channel: string;
}

export interface IBot extends Client {
  numReferences?: number;
}

export interface ICallback {
  event: string;
  listener: (param: any) => void;
}
export type NamedChannel = TextChannel | GroupDMChannel;

export interface IFromDiscordMsg {
  _msgid: string;
  payload: string;
  channel: NamedChannel | DMChannel;
  author: User;
  member: GuildMember;
  memberRoleNames: string[] | null;
  attachments?: IFile[];
  rawData?: Message;
}

export interface IFile {
  filename: string;
  href: string;
}

export interface IAttachment {
  name: string;
  file: string | Buffer | Stream;
}

export interface IToDiscordChannel {
  channel?: string;
  payload: string;
  rich?: IRichEmbedArgs;
  attachments?: IAttachment[];
}

export interface IMentionMap {
  id: string;
  name: string;
}

export interface IRichEmbedArgs {
  title?: string;
  author: {
    name: string;
    icon?: string;
    url?: string;
  };
  attachments?: Attachment[];
  text?: string;
  description?: string;
}
