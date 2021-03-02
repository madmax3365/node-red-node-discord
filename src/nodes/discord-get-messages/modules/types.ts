import { Node, NodeDef } from 'node-red';
import { DiscordGetMessagesOptions } from '../shared/types';

export interface DiscordGetMessagesNodeDef
  extends NodeDef,
    DiscordGetMessagesOptions {}

// export interface DiscordGetMessagesNode extends Node {}
export type DiscordGetMessagesNode = Node;

export interface CanceledMessage {
  id: string;
  url: string;
  code: string;
}
