import { DiscordChannel } from '../../types';
import { isDmChannel } from '../../typeguards';

export class DiscordBaseChannel {
  public id: string;
  public type: string;
  public name: string | null;
  public createdAt: string;

  constructor(channel: DiscordChannel) {
    this.id = channel.id;
    this.type = channel.type;
    if(isDmChannel(channel)) {
      this.name = null
    } else  {
      this.name = channel.name
    }
    this.createdAt = channel.createdAt.toDateString();
  }
}
