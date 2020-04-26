import { Node, Red } from 'node-red';
import {
  IAssignRoleConfig,
  IFromDiscordMsg,
  IShouldAssignRoleResponse,
} from '../lib/interfaces';

export = (RED: Red) => {
  RED.nodes.registerType('discord-assign-role', function(
    this: Node,
    props: IAssignRoleConfig,
  ) {
    RED.nodes.createNode(this, props);
    const node = this;
    // @ts-ignore
    this.on('input', (msg: IShouldAssignRoleResponse, send, done) => {
      node.status({ fill: 'green', shape: 'dot', text: 'ready' });
      msg.member.addRole(msg.roleId);
      const msgid = RED.util.generateId();
      const message = { _msgid: msgid } as IFromDiscordMsg;
      message.member = msg.member;
      node.send(message);
    });
  });
};
