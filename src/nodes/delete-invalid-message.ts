import { Node, Red } from 'node-red';
import {
  IDeleteMessageResponse,
  IDeleteWrongMessageConfig,
  IFromDiscordMsg,
} from '../lib/interfaces';

export = (RED: Red) => {
  RED.nodes.registerType('discord-delete-invalid-message', function(
    this: Node,
    props: IDeleteWrongMessageConfig,
  ) {
    RED.nodes.createNode(this, props);
    const node = this;
    const messageToMatch = props.message;
    // @ts-ignore
    this.on('input', (msg: IFromDiscordMsg, send, done) => {
      node.status({ fill: 'green', shape: 'dot', text: 'ready' });
      const msgid = RED.util.generateId();

      const message: IDeleteMessageResponse = {
        _msgid: msgid,
        member: msg.member,
        memberRoleNames: msg.memberRoleNames,
        payload: '',
      };

      const messageReceived: string = msg.payload;
      if (messageReceived.startsWith(messageToMatch)) {
        message.payload = 'Valid message';
      } else {
        msg.rawData?.delete();
        message.payload = 'Invalid message';
      }
      node.send(message);
    });
  });
};
