import { EditorRED } from 'node-red';
import { DiscordGetMessagesEditorNodeProperties } from './modules/types';
import { NODE_CATEGORY, NODE_COLOR } from '../../shared/constants';

declare const RED: EditorRED;

RED.nodes.registerType<DiscordGetMessagesEditorNodeProperties>(
  'discord-get-messages',
  {
    category: NODE_CATEGORY,
    color: NODE_COLOR,
    defaults: {
      name: { value: '' },
      token: { type: 'discord-token', value: '', required: true },
      dm: { value: false },
      news: { value: false },
      channels: { value: '' },
      mentions: { value: false },
      listenItself: { value: false },
    },
    inputs: 0,
    outputs: 1,
    icon: 'discord.png',
    paletteLabel: 'Get messages',
    label: function () {
      return this.name || 'Get messages';
    },
  },
);
