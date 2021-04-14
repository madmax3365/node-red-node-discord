import { Client, DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { DiscordMessage } from './lib/model/DiscordMessage';
import { NodeMessageInFlow } from 'node-red';

export interface Bot extends Client {
  refs: number;
}

export type UserType = 'bot' | 'user';

export interface DiscordReaction {
  message: DiscordMessage;
}

export interface RedMessage<T extends DiscordMessage | DiscordReaction>
  extends NodeMessageInFlow {
  payload?: string;
  metadata: T;
  type: 'reaction' | 'message';
}

export type DiscordChannel = NewsChannel | DMChannel | TextChannel;

export type DiscordChannelType = 'news' | 'dm' | 'text';

export type NodeType = 'discord-get-messages' | 'discord-send-messages';

export type DiscordReactionEventType = 'add' | 'remove';
