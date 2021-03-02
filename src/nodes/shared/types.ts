import { Client, DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { DiscordMessage } from './lib/model/DiscordMessage';

export interface Bot extends Client {
  refs: number;
}

export interface NodeEventCallback {
  event: string;
  listener: (...params: any[]) => void;
}

export type UserType = 'bot' | 'user';

export interface DiscordHandler {
  bot: Client;
}

export interface MentionMap {
  id: string;
  name: string;
}

export interface RedMessage {
  payload: string;
  rawMsg?: string;
  metadata: DiscordMessage;
}

export type DiscordChannel = NewsChannel | DMChannel | TextChannel;

export type NodeType = 'discord-get-messages' | 'discord-send-messages';
