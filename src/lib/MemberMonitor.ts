import { Collection, TextChannel } from 'discord.js';
import {
  IBot,
  IChannelMetric,
  IMetricMemberItem,
  IMetricRoleItem,
  ITextChannelMetric,
} from './interfaces';

export class MemberMonitor {
  constructor(private bot: IBot) {}

  private get channels() {
    return this.bot.channels;
  }

  // TODO: Handle voice channels
  // private get voiceChannels() {
  //   return this.channels.filter((channel) => channel.type === 'voice');
  // }

  private get textChannels() {
    return this.channels.filter(
      (channel) => channel.type === 'text',
    ) as Collection<string, TextChannel>;
  }

  public get textChannelMetric() {
    const result = {} as IChannelMetric;
    for (const [id, channel] of this.textChannels) {
      const channelMetric = {
        channelName: channel.name,
        id,
        members: [],
      } as ITextChannelMetric;

      // Members metric
      channel.members.forEach((member) => {
        const memberMetric: IMetricMemberItem = {
          id: member.id,
          joinedDate: member.joinedAt,
          permissions: member.permissionsIn(id).toArray(),
          roles: [],
          username: member.user.username,
        };
        const { roles } = member;
        roles.forEach((role) => {
          const roleMetric: IMetricRoleItem = {
            id: role.id,
            name: role.name,
            permissions: role.permissions,
          };
          memberMetric.roles.push(roleMetric);
        });
        channelMetric.members.push(memberMetric);
      });
      const category = channel.parent.name;
      if (result[category]) {
        result[category].push(channelMetric);
      } else {
        result[category] = [channelMetric];
      }
    }
    return result;
  }
}
