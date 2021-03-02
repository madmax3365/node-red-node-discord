import { EditorNodeProperties } from 'node-red';
import { DiscordGetMessagesOptions } from '../../shared/types';

export interface DiscordGetMessagesEditorNodeProperties
  extends EditorNodeProperties,
    DiscordGetMessagesOptions {}
