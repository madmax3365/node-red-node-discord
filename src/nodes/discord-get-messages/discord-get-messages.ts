import { NodeInitializer } from 'node-red';
import {
  DiscordGetMessagesNode,
  DiscordGetMessagesNodeDef,
} from './modules/types';
import { DiscordTokenNode } from '../discord-token/modules/types';
import { BotConnector } from '../shared/lib/BotConnector';
import { BotEventHandler } from '../shared/lib/BotEventHandler';
import { Message } from 'discord.js';
import { DiscordMessage } from '../shared/lib/model/DiscordMessage';
import { RedMessage } from '../shared/types';
import { MentionsHandler } from '../shared/lib/MentionsHandler';

const nodeInit: NodeInitializer = (RED): void => {
  function DiscordGetMessagesNodeConstructor(
    this: DiscordGetMessagesNode,
    config: DiscordGetMessagesNodeDef,
  ): void {
    RED.nodes.createNode(this, config);

    const { token } = RED.nodes.getNode(config.token) as DiscordTokenNode;

    if (!token) {
      this.error('Access token not specified');
      return;
    }

    const botConnector = new BotConnector();

    const rawChannels = config.channels;

    botConnector
      .get(token)
      .then((bot) => {
        this.status({ fill: 'green', shape: 'dot', text: 'ready' });
        const botEventHandler = new BotEventHandler(bot);

        botEventHandler.registerEvent({
          event: 'message',
          listener: (message: Message) => {
            let processingDeclined = false;
            switch (message.channel.type) {
              case 'dm':
                processingDeclined = config.dm;
                break;
              case 'news':
                processingDeclined = config.news;
                break;
              case 'text':
                const channels =
                  config.channels.length > 0
                    ? rawChannels
                        .split('#')
                        .map((e: string) => e.trim())
                        .filter((e: string) => e !== '')
                    : [];
                if (channels.length === 0) {
                  processingDeclined = false;
                } else {
                  processingDeclined =
                    !channels.includes(message.channel.id) &&
                    !channels.includes(message.channel.name);
                }
            }

            if (processingDeclined || message.author.id === bot.user?.id) {
              return;
            }

            const msg = {
              payload: message.content,
              metadata: new DiscordMessage(message),
            } as RedMessage;

            if (!config.mentions) {
              const mentionsHandler = new MentionsHandler(bot);
              const formattedMessage = mentionsHandler.fromDiscord(msg.payload);
              if (msg.payload !== formattedMessage) {
                msg.rawMsg = msg.payload;
              }
              msg.payload = formattedMessage;
              msg.metadata.content = formattedMessage;
            }

            this.send(msg);
          },
        });

        botEventHandler.registerEvent({
          event: 'error',
          listener: (err: Error) => {
            this.error(err);
            this.status({ fill: 'red', shape: 'dot', text: 'error' });
          },
        });
        this.on('close', () => {
          botEventHandler.destroy();
        });
      })
      .catch((err: Error) => {
        this.error(err);
        this.status({ fill: 'red', shape: 'dot', text: 'wrong token?' });
      });
  }

  RED.nodes.registerType(
    'discord-get-messages',
    DiscordGetMessagesNodeConstructor,
  );
};

export = nodeInit;
