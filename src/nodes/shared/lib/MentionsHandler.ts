import { Guild, Role, User } from 'discord.js';
import { DiscordMessageEmbed } from '../../discord-send-messages/modules/DiscordMessageEmbed';
import { RichEmbedArgs } from '../../discord-send-messages/modules/types';

export type InputType = 'discord' | 'flow';

export class MentionsHandler {
  constructor(private guild: Guild) {}

  public async handleAll(msg: string, type: InputType): Promise<string>;
  public async handleAll(
    msg: string | undefined,
    type: InputType,
  ): Promise<string | undefined>;
  public async handleAll(
    msg: string | null,
    type: InputType,
  ): Promise<string | null>;
  public async handleAll(
    msg: string | null | undefined,
    type: InputType,
  ): Promise<string | null | undefined> {
    if (!msg) {
      return msg;
    }
    let res = msg;
    res = await this.handleUsers(res, type);
    res = await this.handleRoles(res, type);

    return res;
  }

  public async handleEmbed(
    data: RichEmbedArgs,
    type: InputType,
  ): Promise<RichEmbedArgs> {
    const res = data;
    res.title = await this.handleAll(res.title, type);
    res.description = await this.handleAll(res.description, type);
    if (res.footer) {
      res.footer.text = await this.handleAll(res.footer.text, type);
    }
    if (res.field) {
      res.field.value = await this.handleAll(res.field.value, type);
    }

    if (res.fields) {
      for (const field of res.fields) {
        field.value = await this.handleAll(field.value, type);
      }
    }
    return res;
  }

  private async handleUsers(msg: string, type: InputType): Promise<string> {
    let res = msg;

    const mentions = extractUserMentions(msg, type);

    if (!mentions || mentions.length === 0) {
      return res;
    }

    for (const mention of mentions) {
      const query = prepareUserQuery(mention, type);

      const user =
        type === 'discord'
          ? await this.resolveUserId(query)
          : await this.resolveUsername(query);

      if (user) {
        res = res.replace(
          mention,
          type === 'discord' ? user.username : `<@!${user.id}>`,
        );
      }
    }

    return res;
  }

  private async handleRoles(msg: string, type: InputType): Promise<string> {
    let res = msg;
    const mentions = extractRoleMentions(msg, type);

    if (!mentions || mentions.length === 0) {
      return res;
    }

    for (const mention of mentions) {
      const query = prepareRoleQuery(mention, type);
      const role =
        type === 'discord'
          ? await this.resolveRoleId(query)
          : await this.resolveRoleName(query);
      if (role) {
        res = res.replace(
          mention,
          type === 'discord' ? role.name : `<@&${role.id}>`,
        );
      }
    }
    return res;
  }

  private async resolveRoleId(id: string): Promise<Role | undefined> {
    try {
      return (await this.guild.roles.fetch(id)) ?? undefined;
    } catch {
      return;
    }
  }

  private async resolveRoleName(name: string): Promise<Role | undefined> {
    try {
      let role = await this.guild.roles.cache.find((r) => r.name === name);
      if (!role) {
        role = (await this.guild.roles.fetch()).cache.find(
          (r) => r.name === name,
        );
      }
      return role;
    } catch {
      return;
    }
  }

  private async resolveUserId(id: string): Promise<User | undefined> {
    try {
      const member = await this.guild.members.fetch(id);
      return member?.user;
    } catch {
      return;
    }
  }

  private async resolveUsername(username: string): Promise<User | undefined> {
    try {
      const member = await this.guild.members.fetch({
        query: username,
        limit: 1,
      });

      return member.first()?.user;
    } catch {
      return;
    }
  }
}

function prepareUserQuery(src: string, type: InputType): string {
  return src
    .replace(type === 'discord' ? '<@!' : '@!(', '')
    .replace(type === 'discord' ? '>' : ')', '');
}

function extractUserMentions(msg: string, type: InputType): string[] | null {
  const pattern = type === 'discord' ? /<@!(\d*?)>/g : /@!\(([\s\S]*?)\)/g;
  return msg.match(pattern);
}

function prepareRoleQuery(src: string, type: InputType) {
  return src
    .replace(type === 'discord' ? '<@&' : '@&(', '')
    .replace(type === 'discord' ? '>' : ')', '');
}

function extractRoleMentions(msg: string, type: InputType) {
  const pattern = type === 'discord' ? /<@&(\d*?)>/g : /@&\(([\s\S]*?)\)/g;
  return msg.match(pattern);
}
