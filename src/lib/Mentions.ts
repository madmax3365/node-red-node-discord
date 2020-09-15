import { User } from 'discord.js';

import { IBot, IMentionMap } from './interfaces';

export class Mentions {
  private message: string;
  private bot: IBot;
  constructor(msg: string, botInstance: IBot) {
    this.message = msg;
    this.bot = botInstance;
  }

  get formattedInputMessage(): string {
    let res = this.message;
    if (res && res.length > 0) {
      const mentions = this.extractIdMentions();
      if (mentions.length === 0) {
        return res;
      }
      const mentionMap = this.getUserNamesFromMentions(mentions);

      mentionMap.forEach((map: IMentionMap) => {
        const { id, name } = map;
        if (id !== name) {
          res = res.replace(id, name);
        }
      });
    }
    return res;
  }

  get formattedOutputMessage(): string {
    let res = this.message;
    if (res && res.length > 0) {
      const mentions = this.extractNameMentions();
      if (mentions.length === 0) {
        return res;
      }

      const mentionMap = this.getUserIdsFromMentions(mentions);
      mentionMap.forEach((map: IMentionMap) => {
        const { id, name } = map;
        if (id !== name) {
          res = res.replace(name, id);
        }
      });
    }
    return res;
  }

  private getUserNamesFromMentions(mentions: string[]): IMentionMap[] {
    const result = [] as IMentionMap[];
    mentions.forEach((mention: string) => {
      const matches = mention.match(/^<@!?(\d+)>$/);
      if (!matches) {
        // For now push mention back
        result.push({ id: mention, name: mention });
      } else {
        const id = matches[1];
        const user = this.bot.users.resolve(id);
        if (user) {
          result.push({ id: mention, name: user.username });
        } else {
          result.push({ id: mention, name: mention });
        }
      }
    });
    return result;
  }

  private extractIdMentions(): string[] {
    const mentions = this.message.match(/\<@(.*?)\>/g);
    return mentions || [];
  }

  private extractNameMentions(): string[] {
    const mentions = this.message.match(/\@(\w+)/g);
    if (!mentions) {
      return [];
    }
    return mentions.filter(
      (mention: string) => !['@everyone', '@here'].includes(mention),
    );
  }

  private getUserIdsFromMentions(mentions: string[]): IMentionMap[] {
    const result = [] as IMentionMap[];
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
}
