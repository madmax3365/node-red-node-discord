import { Client, DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { DiscordMessage } from './lib/model/DiscordMessage';
import { NodeMessageInFlow } from 'node-red';

export interface Bot extends Client {
  refs: number;
}

export type UserType = 'bot' | 'user';

export interface DiscordHandler {
  bot: Client;
}

export interface MentionMap {
  id: string;
  name: string;
}

export interface RedMessage extends NodeMessageInFlow {
  payload: string;
  rawMsg?: string;
  metadata: DiscordMessage;
}

export type DiscordChannel = NewsChannel | DMChannel | TextChannel;

export type DiscordChannelType = 'news' | 'dm' | 'text';

export type NodeType = 'discord-get-messages' | 'discord-send-messages';
