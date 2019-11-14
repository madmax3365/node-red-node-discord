import { Attachment, Channel, RichEmbed } from 'discord.js';
import { Node, Red } from 'node-red';

import { Bot } from '../lib/Bot';
import { Embed } from '../lib/Embed';
import {
  IBot,
  IConnectConfig,
  ISendMessageProps,
  IToDiscordChannel,
} from '../lib/interfaces';
import { Mentions } from '../lib/Mentions';
import { isEmbed, isNamedChannel } from '../lib/utils';

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
                const mentionResolver = new Mentions(msg.payload, bot);
                let outputMessage: string | RichEmbed =
                  mentionResolver.formattedOutputMessage;
                if (msg.rich) {
                  const { rich } = msg;
                  rich.text = outputMessage;
                  if (attachments && attachments.length > 0) {
                    rich.attachments = attachments;
                  }
                  outputMessage = Embed(rich);
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
