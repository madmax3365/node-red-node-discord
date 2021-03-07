import { Client, Message, NewsChannel, TextChannel } from 'discord.js';
import { NodeFlowMessage } from './types';
import { prepareMessageWithMentions, prepareMsg } from './helpers';

export class MessageTransporter {
  constructor(private client: Client) {}

  public async sendToUser(
    id: string,
    input: NodeFlowMessage,
  ): Promise<Message> {
    const user = await this.client.users.fetch(id);

    if (!user) {
      throw new Error(`Can't find user with id ${id}`);
    }

    const msgArgs = await prepareMsg(input);
    if (msgArgs.additions) {
      return await user.send(msgArgs.content, msgArgs.additions);
    } else {
      return await user.send(msgArgs.content);
    }
  }

  public async sentToTextChannel(
    id: string,
    input: NodeFlowMessage,
  ): Promise<Message> {
    let channel = this.client.channels.cache.find((ch) => ch.id === id);
    if (!channel) {
      channel = await this.client.channels.fetch(id);

      if (!channel) {
        throw new Error(`Can't find channel with id ${id}`);
      }
    }
    const guild = (channel as TextChannel | NewsChannel).guild;
    const msgArgs = await prepareMessageWithMentions(input, guild);
    if (msgArgs.additions) {
      return await (channel as TextChannel | NewsChannel).send(
        msgArgs.content,
        msgArgs.additions,
      );
    } else {
      return await (channel as TextChannel | NewsChannel).send(msgArgs.content);
    }
  }
}
