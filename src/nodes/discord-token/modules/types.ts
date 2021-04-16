import { Node, NodeDef } from 'node-red';
import { DiscordTokenOptions } from '../shared/types';

export interface DiscordTokenNodeDef extends NodeDef, DiscordTokenOptions {}

export interface DiscordTokenNode extends Node<{ token: string }> {
  token: string;
}
