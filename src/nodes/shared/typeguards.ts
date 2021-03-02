import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { DiscordChannel } from './types';

export function isDmChannel(channel: DiscordChannel): channel is DMChannel {
  return channel.type === 'dm';
}

export function isTextChannel(channel: DiscordChannel): channel is TextChannel {
  return channel.type == 'text';
}

export function isNewsChannel(channel: DiscordChannel): channel is NewsChannel {
  return channel.type == 'news';
}
