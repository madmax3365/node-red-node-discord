import { EditorRED } from 'node-red';
import { DiscordTokenEditorNodeProperties } from './modules/types';

declare const RED: EditorRED;

RED.nodes.registerType<DiscordTokenEditorNodeProperties>('discord-token', {
  category: 'config',
  defaults: {
    name: { value: '' },
    token: { value: '', required: true },
  },
  label: function () {
    return this.name || 'discord token';
  },
});
