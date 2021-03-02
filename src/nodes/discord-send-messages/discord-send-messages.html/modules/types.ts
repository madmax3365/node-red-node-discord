import { EditorNodeProperties } from 'node-red';
import { DiscordSendMessagesOptions } from '../../shared/types';

export interface DiscordSendMessagesEditorNodeProperties
  extends EditorNodeProperties,
    DiscordSendMessagesOptions {}
