import { EditorNodeProperties } from 'node-red';
import { DiscordTokenOptions } from '../../shared/types';

export interface DiscordTokenEditorNodeProperties
  extends EditorNodeProperties,
    DiscordTokenOptions {}
