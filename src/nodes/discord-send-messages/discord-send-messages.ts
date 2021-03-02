import { NodeInitializer } from 'node-red';
import {
  DiscordSendMessagesNode,
  DiscordSendMessagesNodeDef,
} from './modules/types';
import { DiscordTokenNode } from '../discord-token/modules/types';

import { Client } from 'discord.js';
import { prepareClient } from '../shared/lib/common';
import { NodeStatusMessage } from '../shared/constants';

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

    const loginAction = (instance: Client) => {
      this.on('input', (msg) => {});
    };

    const client = prepareClient(this, token, loginAction);

    this.on('close', () => {
      client.destroy();
    });
  }

  RED.nodes.registerType(
    'discord-send-messages',
    DiscordSendMessagesNodeConstructor,
  );
};

export = nodeInit;
