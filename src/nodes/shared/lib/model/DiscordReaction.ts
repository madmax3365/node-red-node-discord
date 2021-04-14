import { DiscordUser } from './DiscordUser';
import { DiscordEmoji } from './DiscordEmoji';
import { MessageReaction, PartialUser, User } from 'discord.js';
import { DiscordMessage } from './DiscordMessage';
import { DiscordReactionEventType } from '../../types';

export class DiscordReaction {
  public user: DiscordUser;
  public emoji: DiscordEmoji;
  public message: DiscordMessage;
  public count: number | null;
  public event: DiscordReactionEventType;

  constructor(
    reaction: MessageReaction,
    user: User | PartialUser,
    event: DiscordReactionEventType,
  ) {
    this.user = new DiscordUser(user);
    this.emoji = new DiscordEmoji(reaction.emoji);
    this.message = new DiscordMessage(reaction.message);
    this.count = reaction.count;
    this.event = event;
  }
}
