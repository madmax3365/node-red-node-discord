import { MessageReaction, User } from 'discord.js';
import { Node, Red } from 'node-red';

import { Bot } from '../lib/Bot';
import {
  IBot,
  ICallback,
  IConnectConfig,
  IDiscordChannelConfig,
  IMessageReaction,
  NamedChannel,
} from '../lib/interfaces';
import { Reactions } from '../lib/Reactions';

export = (RED: Red) => {
  RED.nodes.registerType('discord-get-emoji-reactions', function(
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
            listener: (param?: any, param2?: any) => void,
          ) => {
            callbacks.push({ event, listener });
            bot.on(event, listener);
          };
          registerCallback(
            'messageReactionAdd',
            (reaction: MessageReaction, user: User) => {
              let processingAllowed = !channels.length;
              const message = reaction.message;
              if (!processingAllowed) {
                if (message.channel.type.trim() !== 'dm') {
                  const channel = message.channel as NamedChannel;
                  if (!channels.includes(channel.name)) {
                    processingAllowed = false;
                  } else {
                    processingAllowed = true;
                  }
                }
              }
              if (message.author !== bot.user && processingAllowed) {
                const msgid = RED.util.generateId();
                const msg = { _msgid: msgid } as IMessageReaction;
                const msgReaction = new Reactions(reaction, user);
                msg.payload = msgReaction.formatPayloadMessage;
                msg.channel = message.channel;
                msg.member = message.member;
                msg.topic = message.member.user.id;
                try {
                  node.send(msg);
                } catch (e) {
                  node.error(e);
                }
                // for saving member role names
                // msg.memberRoleNames = message.member
                //   ? message.member.roles.array().map((item: Role) => {
                //       return item.name;
                //     })
                //   : null;
              }
            },
          );
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
          // tslint:disable-next-line:no-console
          console.log('PROMISE ERROR', 'HOPEFULLY STOPPING ISSUES');
          node.error(err);
          node.send(configNode);
          node.status({ fill: 'red', shape: 'dot', text: 'wrong token?' });
        });
    } else {
      this.error('Access token not specified');
    }
  });
};
