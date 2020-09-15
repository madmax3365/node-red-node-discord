import {
  MessageAttachment,
  Client,
  ColorResolvable,
  DMChannel,
  GuildMember,
  Message,
  MessageReaction,
  PermissionString,
  TextChannel,
  User,
  NewsChannel,
} from 'discord.js';
import { Node, NodeDef, NodeMessage } from 'node-red';
import { Stream } from 'stream';

export interface IConnectConfig extends Node {
  credentials: {
    token: string;
  };
  token?: string;
}

export interface IDiscordChannelConfig extends NodeDef {
  token: string;
  channels: string;
}

export interface ISendMessageProps extends NodeDef {
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

export type NamedChannel = TextChannel;

export interface IFromDiscordMsg {
  _msgid: string;
  payload: string;
  channel: NamedChannel | DMChannel | NewsChannel;
  author: User;
  member: GuildMember | null;
  memberRoleNames: string[] | null;
  attachments?: IFile[];
  rawData?: Message;
}

export interface IFile {
  filename?: string | undefined;
  href: string;
}

export interface IAttachment {
  name: string;
  file: string | Buffer | Stream;
}

export interface IToDiscordChannel extends NodeMessage {
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

  attachments?: MessageAttachment[];
  field?: IRichEmbedField;
  fields?: IRichEmbedField[];
}

interface IRichEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface IChannelMetric {
  [id: string]: ITextChannelMetric[];
}

export interface ITextChannelMetric {
  id: string;
  channelName: string;
  members: IMetricMemberItem[];
}

export interface IMetricRoleItem {
  id: string;
  name: string;
  permissions: number;
}

export interface IMetricMemberItem {
  id: string;
  username: string;
  joinedDate: Date | null;
  permissions: PermissionString[];
  roles: IMetricRoleItem[];
}

export interface IReactionsMap {
  reaction: MessageReaction;
  user: User;
}
