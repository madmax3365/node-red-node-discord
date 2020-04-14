import {
  Attachment,
  Client,
  ColorResolvable,
  DMChannel,
  GroupDMChannel,
  GuildMember,
  Message,
  MessageReaction,
  PermissionString,
  TextChannel,
  User,
} from 'discord.js';
import { Node, NodeProperties } from 'node-red';
import { Stream } from 'stream';

export interface IConnectConfig extends Node {
  credentials: {
    token: string;
  };
  token?: string;
}

export interface IDiscordChannelConfig extends Node {
  token: string;
  channels: string;
}

export interface IShouldAssignRoleConfig extends Node {
  token: string;
  role: string;
  reviewer: string;
  serverId: string;
}

export interface IGetEmojiReactionsConfig extends Node {
  token: string;
  channels: string;
  message: string;
}

export interface IGetMemberRoleConfig extends Node {
  token: string;
  serverId: string;
  roleId: string;
}

export interface IDeleteWrongMessageConfig extends Node {
  token: string;
  channels: string;
  serverId: string;
  message: string;
}

export interface IMessageWithUserId {
  payload: string;
  topic: string;
}

export interface IDeleteWrongMessage {
  payload: string;
  topic: string;
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

export interface IMessageReaction {
  _msgid: string;
  payload: string;
  topic: string;
  channel: NamedChannel | DMChannel;
  member: GuildMember;
  reactionUser: User;
  messageReaction: MessageReaction;
}

export interface IDeleteMessageResponse {
  _msgid: string;
  payload: string;
  member: GuildMember;
  memberRoleNames: string[] | null;
}

export interface IShouldAssignRoleResponse {
  _msgid: string;
  payload: string;
  member: GuildMember;
  roleId: string;
}

export interface IAssignRoleResponse {
  _msgid: string;
  payload: string;
  member: GuildMember;
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

  attachments?: Attachment[];
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
  joinedDate: Date;
  permissions: PermissionString[];
  roles: IMetricRoleItem[];
}

export interface IReactionsMap {
  reaction: MessageReaction;
  user: User;
}
