import { NodeInitializer } from 'node-red';
import { DiscordTokenNode, DiscordTokenNodeDef } from './modules/types';

const nodeInit: NodeInitializer = (RED): void => {
  function DiscordTokenNodeConstructor(
    this: DiscordTokenNode,
    config: DiscordTokenNodeDef,
  ): void {
    RED.nodes.createNode(this, config);
    this.name = config.name;
    this.token = this.credentials.token;
  }

  RED.nodes.registerType('discord-token', DiscordTokenNodeConstructor, {
    credentials: { token: { type: 'text' } },
  });
};

export = nodeInit;
