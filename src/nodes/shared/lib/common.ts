import { Client } from 'discord.js';
import { Node } from 'node-red';
import { NodeStatusMessage } from '../constants';

export function prepareClient(
  node: Node,
  token: string,
  runOnLogin?: (instance: Client) => void,
): Client {
  const client = new Client();

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

  client
    .login(token)
    .then(() => {
      if (runOnLogin) {
        runOnLogin(client);
      }
    })
    .catch((err) => {
      node.error(err);
      node.status({
        fill: 'red',
        shape: 'dot',
        text:
          err.name === 'FetchError'
            ? NodeStatusMessage.CLIENT_NO_CONNECTION
            : NodeStatusMessage.CLIENT_WRONG_TOKEN,
      });
    });

  return client;
}
