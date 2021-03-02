import { NodeInitializer } from 'node-red';
import {
  CanceledMessage,
  DiscordGetMessagesNode,
  DiscordGetMessagesNodeDef,
} from './modules/types';
import { DiscordTokenNode } from '../discord-token/modules/types';
import { DiscordMessage } from '../shared/lib/model/DiscordMessage';
import { RedMessage } from '../shared/types';
import { MentionsHandler } from '../shared/lib/MentionsHandler';
import { prepareClient } from '../shared/lib/common';
import { NodeStatusMessage } from '../shared/constants';
import { extractIds } from '../shared/helpers';
import { BotHolder } from '../shared/lib/BotHolder';

const nodeInit: NodeInitializer = (RED): void => {
  function DiscordGetMessagesNodeConstructor(
    this: DiscordGetMessagesNode,
    config: DiscordGetMessagesNodeDef,
  ): void {
    RED.nodes.createNode(this, config);
    const { token } = RED.nodes.getNode(config.token) as DiscordTokenNode;

    if (!token) {
      this.status({
        fill: 'red',
        shape: 'dot',
        text: NodeStatusMessage.CLIENT_NO_TOKEN,
      });
      return;
    }

    const botHolder = new BotHolder();

    botHolder
      .getBot(token)
      .then((client) => {
        prepareClient(this, client);

        client.on('message', (message) => {
          let processingDeclined = false;
          switch (message.channel.type) {
            case 'dm':
              processingDeclined = config.dm;
              break;
            case 'news':
              processingDeclined = config.news;
              break;
            case 'text':
              const channels = extractIds(config.channels);
              if (channels.length === 0) {
                processingDeclined = false;
              } else {
                processingDeclined =
                  !channels.includes(message.channel.id) &&
                  !channels.includes(message.channel.name);
              }
          }

          if (
            processingDeclined ||
            (message.author.id === client.user?.id && !config.listenItself)
          ) {
            this.debug({
              id: message.id,
              url: message.url,
              code: 'NO_CONDITIONS_MET',
            } as CanceledMessage);
            return;
          }

          const msg = {
            payload: message.content,
            metadata: new DiscordMessage(message),
          } as RedMessage;

          if (!config.mentions) {
            const mentionsHandler = new MentionsHandler(client);
            const formattedMessage = mentionsHandler.fromDiscord(msg.payload);
            if (msg.payload !== formattedMessage) {
              msg.rawMsg = msg.payload;
            }
            msg.payload = formattedMessage;
            msg.metadata.content = formattedMessage;
          }

          this.send(msg);
        });
      })
      .catch((e) => {
        this.error(e);
        this.status({
          fill: 'red',
          shape: 'dot',
          text:
            e.name === 'FetchError'
              ? NodeStatusMessage.CLIENT_NO_CONNECTION
              : NodeStatusMessage.CLIENT_WRONG_TOKEN,
        });
      });
    this.on('close', () => {
      botHolder.destroy(token);
    });
  }

  RED.nodes.registerType(
    'discord-get-messages',
    DiscordGetMessagesNodeConstructor,
  );
};

export = nodeInit;
