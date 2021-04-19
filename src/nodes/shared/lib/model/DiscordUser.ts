import { UserType } from '../../types';
import { PartialUser, User } from 'discord.js';

export class DiscordUser {
  public id: string;
  public username: string | null;
  public tag: string | null;
  public avatar: string | null;
  public defaultAvatarURL: string | null;
  public type: UserType;
  public createdAt: string;
  public locale: string | null;

  constructor(user: User | PartialUser) {
    this.id = user.id;
    this.username = user.username;
    this.tag = user.tag;
    this.avatar = user.avatar;
    this.defaultAvatarURL = user.defaultAvatarURL;
    this.type = user.bot ? 'bot' : 'user';
    this.createdAt = user.createdAt.toDateString();
    this.locale = user.locale;
  }
}
