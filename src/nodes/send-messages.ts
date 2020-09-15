import { MessageAttachment, Channel, MessageEmbed } from 'discord.js';
import { Bot } from '../lib/Bot';
import { Embed } from '../lib/Embed';
import { isEmbed, isNamedChannel } from '../lib/utils';
import { Mentions } from '../lib/Mentions';
import { Node, NodeInitializer, NodeMessage } from 'node-red';

import {
  IBot,
  IConnectConfig,
  ISendMessageProps,
  IToDiscordChannel,
} from '../lib/interfaces';

const nodeInit: NodeInitializer = (RED): void => {
  RED.nodes.registerType('discord-send-messages', function (
    this: Node,
    config: ISendMessageProps,
  ) {
    RED.nodes.createNode(this, config);
    const node = this;
    const configNode = RED.nodes.getNode(config.token) as IConnectConfig;
    const { token } = configNode;
    if (token) {
      const botInstance = new Bot();
      botInstance
        .get(token)
        .then((bot: IBot) => {
          node.on('input', (_msg: NodeMessage): void => {
            const msg = _msg as IToDiscordChannel;
            const channel = msg.channel || config.channel;
            if (channel) {
              let channelInstance: Channel | undefined | null;
              if (isNaN(parseInt(channel, 10))) {
                channelInstance = bot.channels.cache.find(
                  (instance: Channel) => {
                    if (isNamedChannel(instance)) {
                      return instance.name === channel;
                    }
                    return false;
                  },
                );
              } else {
                channelInstance = bot.channels.resolve(channel);
              }
              if (channelInstance && isNamedChannel(channelInstance)) {
                const attachments = [] as MessageAttachment[];
                if (msg.attachments) {
                  msg.attachments.forEach(({ file, name }) => {
                    attachments.push(new MessageAttachment(file, name));
                  });
                }
                let outputMessage: string | MessageEmbed;
                if (msg.rich) {
                  const { description, fields } = msg.rich;
                  if (description) {
                    msg.rich.description = new Mentions(
                      description,
                      bot,
                    ).formattedOutputMessage;
                  }
                  if (msg.rich.field) {
                    msg.rich.field.value = new Mentions(
                      msg.rich.field.value,
                      bot,
                    ).formattedOutputMessage;
                  }
                  if (fields) {
                    msg.rich.fields = fields.map((field) => {
                      field.value = new Mentions(
                        field.value,
                        bot,
                      ).formattedOutputMessage;
                      return field;
                    });
                  }
                  if (
                    attachments &&
                    attachments.length > 0 &&
                    !msg.rich.attachments
                  ) {
                    msg.rich.attachments = attachments;
                  }
                  outputMessage = Embed(msg.rich);
                } else {
                  outputMessage = new Mentions(msg.payload, bot)
                    .formattedOutputMessage;
                }
                channelInstance
                  .send(
                    outputMessage,
                    isEmbed(outputMessage) ? { files: attachments } : {},
                  )
                  .then(() => {
                    node.status({
                      fill: 'green',
                      shape: 'dot',
                      text: 'message sent',
                    });
                  })
                  .catch((err: Error) => {
                    node.error("Couldn't send to channel:" + err);
                    node.status({
                      fill: 'red',
                      shape: 'dot',
                      text: 'send error',
                    });
                  });
              } else {
                // TODO: Handle DM
                node.error(
                  `Couldn't send to channel '${channel}': channel not found.`,
                );
                node.status({ fill: 'red', shape: 'dot', text: 'error' });
              }
            }
          });
          node.on('close', () => {
            botInstance.destroy(bot);
          });
        })
        .catch((err: Error) => node.error(err));
    } else {
      this.error('Access token not specified');
    }
  });
};

export = nodeInit;
