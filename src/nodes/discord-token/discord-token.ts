import { NodeInitializer } from 'node-red';
import { DiscordTokenNode, DiscordTokenNodeDef } from './modules/types';

const nodeInit: NodeInitializer = (RED): void => {
  function DiscordTokenNodeConstructor(
    this: DiscordTokenNode,
    config: DiscordTokenNodeDef,
  ): void {
    RED.nodes.createNode(this, config);
    this.name = config.name;
    this.token = config.token;
  }

  RED.nodes.registerType('discord-token', DiscordTokenNodeConstructor);
};

export = nodeInit;
