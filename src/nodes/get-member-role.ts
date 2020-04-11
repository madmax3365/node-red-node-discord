import { Role } from 'discord.js';
import Flatted = require('flatted');
import { Node, Red } from 'node-red';
import { Bot } from '../lib/Bot';
import {
  IBot,
  IConnectConfig,
  IGetMemberRoleConfig,
  IMessageWithUserId,
} from '../lib/interfaces';

export = (RED: Red) => {
  RED.nodes.registerType('discord-get-member-role', function(
    this: Node,
    props: IGetMemberRoleConfig,
  ) {
    RED.nodes.createNode(this, props);
    const configNode = RED.nodes.getNode(props.token) as IConnectConfig;
    const { token } = configNode;
    const node = this;
    const botInstance = new Bot();
    const rawRoleIds = props.roleId;
    // @ts-ignore
    const roleIds: string[] =
      rawRoleIds.length > 0
        ? rawRoleIds
            .split('#')
            .map((e: string) => e.trim())
            .filter((e: string) => e !== '')
        : [];
    const serverId = props.serverId;

    // @ts-ignore -> send is never used
    this.on('input', (msg: IMessageWithUserId, send, done) => {
      node.status({ fill: 'green', shape: 'dot', text: 'ready' });
      const userId = msg.topic;

      if (token) {
        botInstance
          .get(token)
          .then((bot: IBot) => {
            const guild = bot.guilds.get(serverId);
            const guildMember = guild!!.members.get(userId);
            let isMemberOneOfTheRoles = false;
            roleIds.forEach((role) => {
              if (guildMember != null) {
                if (guildMember.roles.has(role)) {
                  isMemberOneOfTheRoles = true;
                }
              }
            });
            // tslint:disable-next-line:no-console
            console.log(
              'Does the member have one of the roles specified?',
              isMemberOneOfTheRoles,
            );
            const roles: string[] = [];
            if (guildMember != null) {
              guildMember.roles.forEach((role) => {
                roles.push(Flatted.parse(Flatted.stringify(role as Role)));
              });
            }
            msg.payload = Flatted.parse(Flatted.stringify(roles));
            node.send(msg);
            if (done) {
              done();
            }
            node.on('close', () => {
              botInstance.destroy(bot);
            });
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
