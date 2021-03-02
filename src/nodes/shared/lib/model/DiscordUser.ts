import { UserType } from '../../types';
import { User } from 'discord.js';

export class DiscordUser {
  public id: string;
  public username: string;
  public avatar: string | null;
  public defaultAvatarURL: string;
  public type: UserType;
  public createdAt: string;
  public locale: string | null;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.avatar = user.avatar;
    this.defaultAvatarURL = user.defaultAvatarURL;
    this.type = user.bot ? 'bot' : 'user';
    this.createdAt = user.createdAt.toDateString();
    this.locale = user.locale;
  }
}
