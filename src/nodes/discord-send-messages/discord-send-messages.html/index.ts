import { EditorRED } from 'node-red';
import { DiscordSendMessagesEditorNodeProperties } from './modules/types';
import {
  COMMA_SEPARATED_NUMBERS_RE,
  NODE_CATEGORY,
  NODE_COLOR,
} from '../../shared/constants';

declare const RED: EditorRED;

RED.nodes.registerType<DiscordSendMessagesEditorNodeProperties>(
  'discord-send-messages',
  {
    category: NODE_CATEGORY,
    color: NODE_COLOR,
    defaults: {
      name: { value: '' },
      token: { value: '', type: 'discord-token', required: true },
      dm: {
        value: '',
        validate: RED.validators.regex(COMMA_SEPARATED_NUMBERS_RE),
      },
      channel: {
        value: '',
        validate: RED.validators.regex(COMMA_SEPARATED_NUMBERS_RE),
      },
    },
    inputs: 1,
    outputs: 0,
    icon: 'discord.png',
    paletteLabel: 'Send messages',
    label: function () {
      return this.name || 'Send messages';
    },
  },
);
