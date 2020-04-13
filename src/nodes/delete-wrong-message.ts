import Flatted = require('flatted');
import { Node, Red } from 'node-red';
import { Bot } from '../lib/Bot';
import {
  IBot,
  IDeleteWrongMessageConfig,
  IFromDiscordMsg,
} from '../lib/interfaces';

export = (RED: Red) => {
  RED.nodes.registerType('discord-delete-wrong-message', function(
    this: Node,
    props: IDeleteWrongMessageConfig,
  ) {
    RED.nodes.createNode(this, props);
    const configNode = RED.nodes.getNode(
      props.token,
    ) as IDeleteWrongMessageConfig;
    const { token } = configNode;
    const node = this;
    const botInstance = new Bot();
    const messageToMatch = props.message;
    // @ts-ignore
    this.on('input', (msg: IFromDiscordMsg, send, done) => {
      node.status({ fill: 'green', shape: 'dot', text: 'ready' });
      if (msg.rawData != null) {
        // tslint:disable-next-line:no-console
        console.log('DELETE WRONG MESSAGE', msg.rawData.channel.lastMessageID);
      } else {
        // tslint:disable-next-line:no-console
        console.log('DELETE WRONG MESSAGE', msg.rawData);
      }
      if (msg.payload === messageToMatch) {
        // tslint:disable-next-line:no-console
        console.log(
          'DELETE WRONG MESSAGE',
          'Messages are the same!\n' + msg.payload + '\n' + messageToMatch,
        );
      } else {
        // tslint:disable-next-line:no-console
        console.log(
          'DELETE WRONG MESSAGE',
          'Invalid message!\n' + msg.payload + '\n' + messageToMatch,
        );
        msg.rawData?.delete();
      }
      if (token) {
        botInstance
          .get(token)
          .then((bot: IBot) => {
            node.send(Flatted.parse(Flatted.stringify(bot)));
          })
          .catch((err: Error) => {
            node.error(err);
            node.status({ fill: 'red', shape: 'dot', text: 'wrong token?' });
          });
      } else {
        this.error('Access token not specified');
      }
    });
  });
};
