import { Node, Red } from 'node-red';
import { IDeleteWrongMessageConfig, IFromDiscordMsg } from '../lib/interfaces';

export = (RED: Red) => {
  RED.nodes.registerType('discord-reply-direct-message', function(
    this: Node,
    props: IDeleteWrongMessageConfig,
  ) {
    RED.nodes.createNode(this, props);
    const node = this;
    const messageToSend = props.message;
    // @ts-ignore
    this.on('input', (msg: IFromDiscordMsg, send, done) => {
      node.status({ fill: 'green', shape: 'dot', text: 'ready' });
      msg.member.send(messageToSend);
    });
  });
};
