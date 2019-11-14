import { Channel, RichEmbed } from 'discord.js';

import { NamedChannel } from './interfaces';

export function isNamedChannel(channel: Channel): channel is NamedChannel {
  return channel.type === 'text';
}
export function isEmbed(msg: string | RichEmbed): msg is RichEmbed {
  return typeof msg !== 'string';
}
