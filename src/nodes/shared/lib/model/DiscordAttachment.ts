import { MessageAttachment, Snowflake } from 'discord.js';

export class DiscordAttachment {
  public id: string;
  public name: string | null;
  public size: number;
  public url: string;
  public proxyUrl: string;

  constructor(id: Snowflake, attachment: MessageAttachment) {
    this.id = id;
    this.name = attachment.name;
    this.size = attachment.size;
    this.url = attachment.url;
    this.proxyUrl = attachment.proxyURL;
  }
}
