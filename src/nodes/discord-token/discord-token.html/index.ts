import { EditorRED } from 'node-red';
import {
  DiscordTokenEditorNodeProperties,
  DiscordTokenNodeCredentials,
} from './modules/types';

declare const RED: EditorRED;

RED.nodes.registerType<
  DiscordTokenEditorNodeProperties,
  DiscordTokenNodeCredentials
>('discord-token', {
  category: 'config',
  defaults: {
    name: { value: '' },
  },

  credentials: {
    token: { type: 'text' },
  },

  label: function () {
    return this.name || 'discord token';
  },
});
