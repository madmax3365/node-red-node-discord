import { Client } from 'discord.js';
import { Node } from 'node-red';
import { NodeStatusMessage } from '../constants';

export function prepareClient(node: Node, client: Client): void {
  client
    .on('ready', () => {
      node.status({
        fill: 'green',
        shape: 'dot',
        text: NodeStatusMessage.CLIENT_READY,
      });
    })
    .on('error', (err) => {
      node.error(err);
      node.status({
        fill: 'red',
        shape: 'dot',
        text:
          err.name === 'TOKEN_INVALID'
            ? NodeStatusMessage.CLIENT_WRONG_TOKEN
            : NodeStatusMessage.CLIENT_ERROR_UNKNOWN,
      });
    });
}
