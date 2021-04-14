import { GuildEmoji, ReactionEmoji } from 'discord.js';

export class DiscordEmoji {
  public id: string | null;
  public name: string;
  public identifier: string;
  public stringRepresentation: string;

  constructor(emoji: GuildEmoji | ReactionEmoji) {
    this.id = emoji.id;
    this.name = emoji.name;
    this.identifier = emoji.identifier;
    this.stringRepresentation = emoji.toString();
  }
}
