import { NodeInitializer } from 'node-red';
import {
  DiscordSendMessagesNode,
  DiscordSendMessagesNodeDef,
  NodeFlowMessage,
} from './modules/types';
import { DiscordTokenNode } from '../discord-token/modules/types';

import { prepareClient } from '../shared/lib/common';
import { NodeStatusMessage } from '../shared/constants';
import { BotHolder } from '../shared/lib/BotHolder';
import { idsFromParams } from '../shared/helpers';
import { MessageTransporter } from './modules/MessageTransporter';

const nodeInit: NodeInitializer = (RED): void => {
  function DiscordSendMessagesNodeConstructor(
    this: DiscordSendMessagesNode,
    config: DiscordSendMessagesNodeDef,
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
    this.on('input', (_msg) => {
      const input = _msg as NodeFlowMessage;
      if (!input.msg && !input.embed && !input.attachments) {
        this.status({
          fill: 'red',
          shape: 'dot',
          text: NodeStatusMessage.CLIENT_EMPTY_MESSAGE,
        });
        this.error(NodeStatusMessage.CLIENT_EMPTY_MESSAGE);
        return;
      }

      this.status({
        fill: 'grey',
        shape: 'ring',
        text: NodeStatusMessage.CLIENT_CONNECTING,
      });

      botHolder
        .getBot(token)
        .then((client) => {
          prepareClient(this, client);
          const dm = config.dm || input.dm;
          const channel = config.channel || input.channel;
          if (!dm && !channel) {
            this.status({
              fill: 'red',
              shape: 'dot',
              text: NodeStatusMessage.CLIENT_NO_CHANNEL,
            });
            this.error(NodeStatusMessage.CLIENT_NO_CHANNEL);
            return;
          }

          if (dm) {
            const mt = new MessageTransporter(client);
            const ids = idsFromParams(dm);
            ids.forEach((id) => {
              mt.sendToUser(id, input)
                .then((res) => {
                  this.log(res);
                })
                .catch((err) => {
                  this.error(err);
                });
            });
          }
          if (channel) {
            const mt = new MessageTransporter(client);
            const ids = idsFromParams(channel);
            ids.forEach((id) => {
              mt.sentToTextChannel(id, input)
                .then((res) => {
                  this.debug(res.content);

                  this.log(
                    `${res.id} ${NodeStatusMessage.CLIENT_MESSAGE_SUCCESS}`,
                  );
                  this.status({
                    fill: 'green',
                    shape: 'dot',
                    text: NodeStatusMessage.CLIENT_MESSAGE_SUCCESS,
                  });
                })
                .catch((err) => {
                  if (
                    err?.name === 'DiscordAPIError' &&
                    err?.message === 'Unknown Channel'
                  ) {
                    this.error(
                      `${NodeStatusMessage.CLIENT_ERROR_CHANNEL_UNKNOWN} - ${id}`,
                    );
                  }
                  this.error(err);
                });
            });
          }
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
    });

    this.on('close', () => {
      botHolder.destroy(token);
    });
  }

  RED.nodes.registerType(
    'discord-send-messages',
    DiscordSendMessagesNodeConstructor,
  );
};

export = nodeInit;
