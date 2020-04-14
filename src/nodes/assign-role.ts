import { GuildMember } from 'discord.js';
import { Node, Red } from 'node-red';
import {
  IFromDiscordMsg,
  IShouldAssignRoleConfig,
  IShouldAssignRoleResponse,
} from '../lib/interfaces';

export = (RED: Red) => {
  RED.nodes.registerType('discord-assign-role', function(
    this: Node,
    props: IShouldAssignRoleConfig,
  ) {
    RED.nodes.createNode(this, props);
    const node = this;
    // @ts-ignore
    this.on('input', (msg: IShouldAssignRoleResponse, send, done) => {
      node.status({ fill: 'green', shape: 'dot', text: 'ready' });
      msg.member.addRole(msg.roleId).then((guildMember: GuildMember) => {
        // tslint:disable-next-line:no-console
        console.log('GUILD MEMBER', guildMember);
      });
      const msgid = RED.util.generateId();
      const message = { _msgid: msgid } as IFromDiscordMsg;
      message.member = msg.member;
      node.send(message);
    });
  });
};
