import { Attachment, Channel, RichEmbed } from 'discord.js';
import { Bot } from '../lib/Bot';
import { Embed } from '../lib/Embed';
import { isEmbed, isNamedChannel } from '../lib/utils';
import { Mentions } from '../lib/Mentions';
import { Node, Red } from 'node-red';

import {
  IBot,
  IConnectConfig,
  ISendMessageProps,
  IToDiscordChannel,
} from '../lib/interfaces';

export = (RED: Red) => {
  RED.nodes.registerType('discord-send-messages', function(
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
          node.on('input', (msg: IToDiscordChannel) => {
            const channel = msg.channel || config.channel;
            if (channel) {
              let channelInstance;
              if (isNaN(parseInt(channel, 10))) {
                channelInstance = bot.channels.find((instance: Channel) => {
                  if (isNamedChannel(instance)) {
                    return instance.name === channel;
                  }
                  return false;
                });
              } else {
                channelInstance = bot.channels.get(channel);
              }
              if (channelInstance && isNamedChannel(channelInstance)) {
                const attachments = [] as Attachment[];
                if (msg.attachments) {
                  msg.attachments.forEach(({ file, name }) => {
                    attachments.push(new Attachment(file, name));
                  });
                }
                let outputMessage: string | RichEmbed;
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
                const finalMessage = isEmbed(outputMessage)
                  ? [outputMessage]
                  : [outputMessage, { files: attachments }];
                node.warn(finalMessage.length);
                channelInstance
                  .send(...finalMessage)
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
