import { EditorNodeProperties, NodeCredential } from 'node-red';
import { DiscordTokenOptions } from '../../shared/types';

export type DiscordTokenEditorNodeProperties = EditorNodeProperties;

export interface DiscordTokenNodeCredentials {
  token: NodeCredential;
}
