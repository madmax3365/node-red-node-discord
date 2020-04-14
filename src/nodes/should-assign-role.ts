import { Node, Red } from 'node-red';
import { Bot } from '../lib/Bot';
import {
  IBot,
  IConnectConfig,
  IMessageReaction,
  IShouldAssignRoleConfig,
  IShouldAssignRoleResponse,
} from '../lib/interfaces';

export = (RED: Red) => {
  RED.nodes.registerType('discord-should-assign-role', function(
    this: Node,
    props: IShouldAssignRoleConfig,
  ) {
    RED.nodes.createNode(this, props);
    const configNode = RED.nodes.getNode(props.token) as IConnectConfig;
    const { token } = configNode;
    const node = this;
    const botInstance = new Bot();
    // @ts-ignore
    this.on('input', (msg: IMessageReaction, send, done) => {
      node.status({ fill: 'green', shape: 'dot', text: 'ready' });
      const reviewerRoleId = props.reviewer;
      const roleIdToAssign = props.role;
      const serverId = props.serverId;
      const reactionUser = msg.reactionUser;
      const msgid = RED.util.generateId();
      const message = { _msgid: msgid } as IShouldAssignRoleResponse;
      message.member = msg.member;
      message.roleId = roleIdToAssign;

      if (token) {
        botInstance
          .get(token)
          .then((bot: IBot) => {
            message.payload = 'N/A';
            const guild = bot.guilds.get(serverId);
            const messageSender = msg.member;
            let isSenderAlreadyRole = false;
            if (messageSender != null) {
              if (messageSender.roles.has(roleIdToAssign)) {
                isSenderAlreadyRole = true;
              }
            }
            if (!isSenderAlreadyRole) {
              const reactionUserInfo = guild!!.members.get(reactionUser.id);
              let isMod = false;
              if (reactionUserInfo != null) {
                if (reactionUserInfo.roles.has(reviewerRoleId)) {
                  isMod = true;
                }
              }
              if (isMod && !isSenderAlreadyRole) {
                // can assign role
                message.payload = 'Assign';
              }
            }
            node.send(message);
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
