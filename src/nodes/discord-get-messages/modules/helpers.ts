import { extractIds } from '../../shared/helpers';
import { DiscordGetMessagesNodeDef } from './types';
import { DiscordChannel } from '../../shared/types';

export function isProcessingDeclined(
  channel: DiscordChannel,
  config: DiscordGetMessagesNodeDef,
): boolean {
  switch (channel.type) {
    case 'dm':
      return config.dm;
    case 'news':
      return config.news;
    case 'text':
      const channels = extractIds(config.channels);
      if (channels.length === 0) {
        return false;
      } else {
        return (
          !channels.includes(channel.id) && !channels.includes(channel.name)
        );
      }
  }
}
