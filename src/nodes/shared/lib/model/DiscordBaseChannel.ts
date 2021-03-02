import { DiscordChannel } from '../../types';

export class DiscordBaseChannel {
  public id: string;
  public type: string;
  public createdAt: string;

  constructor(channel: DiscordChannel) {
    this.id = channel.id;
    this.type = channel.type;
    this.createdAt = channel.createdAt.toDateString();
  }
}
