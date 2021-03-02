import { Node, NodeDef } from 'node-red';
import { DiscordGetMessagesOptions } from '../shared/types';
import { DMChannel, NewsChannel, TextChannel } from 'discord.js';

export interface DiscordGetMessagesNodeDef
  extends NodeDef,
    DiscordGetMessagesOptions {}

// export interface DiscordGetMessagesNode extends Node {}
export type DiscordGetMessagesNode = Node;

export type DiscordChannel = NewsChannel | DMChannel | TextChannel;
