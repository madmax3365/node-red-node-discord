import { Channel, MessageEmbed } from 'discord.js';

import { NamedChannel } from './interfaces';

export function isNamedChannel(channel: Channel): channel is NamedChannel {
  return channel.type === 'text';
}
export function isEmbed(msg: string | MessageEmbed): msg is MessageEmbed {
  return typeof msg !== 'string';
}
