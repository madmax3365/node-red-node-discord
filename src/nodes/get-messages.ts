import { Message, Role } from 'discord.js';
import { Node, Red } from 'node-red';

import { Bot } from '../lib/Bot';
import {
  IBot,
  ICallback,
  IConnectConfig,
  IDiscordChannelConfig,
  IFromDiscordMsg,
  NamedChannel,
} from '../lib/interfaces';
import { Mentions } from '../lib/Mentions';

export = (RED: Red) => {
  RED.nodes.registerType('discord-get-messages', function(
    this: Node,
    props: IDiscordChannelConfig,
  ) {
    RED.nodes.createNode(this, props);
    const configNode = RED.nodes.getNode(props.token) as IConnectConfig;
    const { token } = configNode;
    const node = this;
    const botInstance = new Bot();
    const rawChannels = props.channels;
    const channels =
      rawChannels.length > 0
        ? rawChannels
            .split('#')
            .map((e: string) => e.trim())
            .filter((e: string) => e !== '')
        : [];
    if (token) {
      botInstance
        .get(token)
        .then((bot: IBot) => {
          const callbacks: ICallback[] = [];
          node.status({ fill: 'green', shape: 'dot', text: 'ready' });

          const registerCallback = (
            event: string,
            listener: (param: any) => void,
          ) => {
            callbacks.push({ event, listener });
            bot.on(event, listener);
          };
          registerCallback('message', (message: Message) => {
            let processingAllowed = !!!channels.length;
            if (!processingAllowed) {
              if (message.channel.type.trim() !== 'dm') {
                const channel = message.channel as NamedChannel;
                if (
                  !channels.includes(channel.name) &&
                  !channels.includes(channel.id)
                ) {
                  processingAllowed = false;
                } else {
                  processingAllowed = true;
                }
              }
            }
            if (message.author !== bot.user && processingAllowed) {
              const msgid = RED.util.generateId();
              const msg = { _msgid: msgid } as IFromDiscordMsg;
              const attachments = message.attachments;
              if (attachments) {
                msg.attachments = attachments.array().map((item) => ({
                  filename: item.filename,
                  href: item.url,
                }));
              }
              const mentionResolver = new Mentions(message.content, bot);
              msg.payload = mentionResolver.formattedInputMessage;
              msg.channel = message.channel;
              msg.author = message.author;
              msg.member = message.member;
              msg.memberRoleNames = message.member
                ? message.member.roles.array().map((item: Role) => {
                    return item.name;
                  })
                : null;
              msg.rawData = message;
              node.send(msg);
            }
          });
          registerCallback('error', (error: Error) => {
            node.error(error);
            node.status({ fill: 'red', shape: 'dot', text: 'error' });
          });
          node.on('close', () => {
            callbacks.forEach((callback: ICallback) => {
              bot.removeListener(callback.event, callback.listener);
            });
            botInstance.destroy(bot);
          });
        })
        .catch((err: Error) => {
          node.error(err);
          node.send(configNode);
          node.status({ fill: 'red', shape: 'dot', text: 'wrong token?' });
        });
    } else {
      this.error('Access token not specified');
    }
  });
};
