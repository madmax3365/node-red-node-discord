import { DiscordUser } from './DiscordUser';
import { Message, MessageType } from 'discord.js';
import { DiscordAttachment } from './DiscordAttachment';
import { DiscordBaseChannel } from './DiscordBaseChannel';

export class DiscordMessage {
  public id: string;
  public content: string;
  public author: DiscordUser;
  public channel: DiscordBaseChannel;
  public url: string;
  public type?: MessageType;
  public pinned: boolean;
  public attachments: DiscordAttachment[];

  constructor(message: Message) {
    this.id = message.id;
    this.content = message.content;
    this.author = new DiscordUser(message.author);
    this.channel = new DiscordBaseChannel(message.channel);
    this.url = message.url;
    this.type = message.type;
    this.pinned = message.pinned;
    const attachments: DiscordAttachment[] = [];
    message.attachments.each((value, key) =>
      attachments.push(new DiscordAttachment(key, value)),
    );
    this.attachments = attachments;
  }
}
