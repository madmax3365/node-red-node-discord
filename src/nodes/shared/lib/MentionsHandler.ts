import { DiscordHandler, MentionMap } from '../types';
import { Client, User } from 'discord.js';

export class MentionsHandler implements DiscordHandler {
  public bot: Client;

  constructor(bot: Client) {
    this.bot = bot;
  }

  public fromDiscord(msg: string): string {
    let res = msg;
    if (res.length > 0) {
      const mentions = this.extractIdMentions(msg);
      if (mentions.length === 0) {
        return res;
      }
      const mentionMap = this.getUserNamesFromMentions(mentions);

      mentionMap.forEach((map: MentionMap) => {
        const { id, name } = map;
        if (id !== name) {
          res = res.replace(id, name);
        }
      });
    }
    return res;
  }

  public toDiscord(msg: string): string {
    let res = msg;
    if (res.length > 0) {
      const mentions = this.extractNameMentions(msg);
      if (mentions.length === 0) {
        return res;
      }

      const mentionMap = this.getUserIdsFromMentions(mentions);
      mentionMap.forEach((map: MentionMap) => {
        const { id, name } = map;
        if (id !== name) {
          res = res.replace(name, id);
        }
      });
    }
    return res;
  }

  private extractIdMentions(msg: string): string[] {
    const mentions = msg.match(/<@(.*?)>/g);
    return mentions || [];
  }

  private extractNameMentions(msg: string): string[] {
    const mentions = msg.match(/@(\w+)/g);
    if (!mentions) {
      return [];
    }
    return mentions.filter(
      (mention: string) => !['@everyone', '@here'].includes(mention),
    );
  }

  private getUserIdsFromMentions(mentions: string[]): MentionMap[] {
    const result: MentionMap[] = [];
    if (mentions.length === 0) {
      return result;
    }
    mentions.forEach((mention: string) => {
      const name = mention.replace('@', '');
      const user = this.bot.users.cache.find(
        (discordUser: User) => discordUser.username === name,
      );
      if (user) {
        result.push({ id: `<@${user.id}>`, name: mention });
      } else {
        result.push({ id: mention, name: mention });
      }
    });
    return result;
  }

  private getUserNamesFromMentions(mentions: string[]): MentionMap[] {
    const result: MentionMap[] = [];
    for (const mention of mentions) {
      const matches = mention.match(/^<@!?(\d+)>$/);
      if (!matches) {
        // For now push mention back
        result.push({ id: mention, name: mention });
      } else {
        const id = matches[1];
        const user = this.bot.users.cache.find(
          (discordUser) => discordUser.id === id,
        );
        if (user) {
          result.push({ id: mention, name: user.username });
        } else {
          result.push({ id: mention, name: mention });
        }
      }
    }
    return result;
  }
}
