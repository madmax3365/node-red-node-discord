import { NodeInitializer } from 'node-red';
import {
  CanceledMessage,
  DiscordGetMessagesNode,
  DiscordGetMessagesNodeDef,
} from './modules/types';
import { DiscordTokenNode } from '../discord-token/modules/types';
import { DiscordMessage } from '../shared/lib/model/DiscordMessage';
import { RedMessage } from '../shared/types';
import { MentionsHandler } from '../shared/lib/MentionsHandler';
import { prepareClient } from '../shared/lib/common';
import { NodeStatusMessage } from '../shared/constants';
import { BotHolder } from '../shared/lib/BotHolder';
import { isDmChannel } from '../shared/typeguards';
import { Guild, MessageReaction } from 'discord.js';
import { isProcessingDeclined } from './modules/helpers';
import { DiscordReaction } from '../shared/lib/model/DiscordReaction';

const nodeInit: NodeInitializer = (RED): void => {
  function DiscordGetMessagesNodeConstructor(
    this: DiscordGetMessagesNode,
    config: DiscordGetMessagesNodeDef,
  ): void {
    RED.nodes.createNode(this, config);
    const { token } = RED.nodes.getNode(config.token) as DiscordTokenNode;

    if (!token) {
      this.status({
        fill: 'red',
        shape: 'dot',
        text: NodeStatusMessage.CLIENT_NO_TOKEN,
      });
      return;
    }

    const botHolder = new BotHolder();

    botHolder
      .getBot(token)
      .then((client) => {
        prepareClient(this, client);

        if (config.reactions) {
          client.on('messageReactionAdd', async (reaction, user) => {
            if (isProcessingDeclined(reaction.message.channel, config)) {
              this.debug({
                id: reaction.message.id,
                url: reaction.message.url,
                code: 'NO_CONDITIONS_MET',
              } as CanceledMessage);
              return;
            }

            if (reaction.partial) {
              try {
                await reaction.fetch();
              } catch (error) {
                this.error(
                  'Something went wrong when fetching the reaction: ',
                  error,
                );
                return;
              }
            }

            const msg = {
              metadata: new DiscordReaction(reaction, user, 'add'),
              type: 'reaction',
            } as RedMessage<DiscordReaction>;

            this.send(await resolveMentionsInReactions(reaction, msg));
          });

          client.on('messageReactionRemove', async (reaction, user) => {
            if (isProcessingDeclined(reaction.message.channel, config)) {
              this.debug({
                id: reaction.message.id,
                url: reaction.message.url,
                code: 'NO_CONDITIONS_MET',
              } as CanceledMessage);
              return;
            }

            if (reaction.partial) {
              try {
                await reaction.fetch();
              } catch (error) {
                this.error(
                  'Something went wrong when fetching the reaction: ',
                  error,
                );
                return;
              }
            }

            const msg = {
              metadata: new DiscordReaction(reaction, user, 'remove'),
              type: 'reaction',
            } as RedMessage<DiscordReaction>;
            this.send(await resolveMentionsInReactions(reaction, msg));
          });
        }

        client.on('message', async (message) => {
          if (
            isProcessingDeclined(message.channel, config) ||
            message.author.id === client.user?.id
          ) {
            this.debug({
              id: message.id,
              url: message.url,
              code: 'NO_CONDITIONS_MET',
            } as CanceledMessage);
            return;
          }

          if (message.partial) {
            try {
              await message.fetch();
            } catch (error) {
              this.error(
                'Something went wrong when fetching the message: ',
                error,
              );
              return;
            }
          }

          const msg = {
            metadata: new DiscordMessage(message),
            type: 'message',
          } as RedMessage<DiscordMessage>;

          if (!config.mentions) {
            const guild = (isDmChannel(message.channel)
              ? message.guild
              : message.channel.guild) as Guild;
            const mentionsHandler = new MentionsHandler(guild);
            const rawMsg = message.content;
            const finalMsg = await mentionsHandler.handleAll(rawMsg, 'discord');
            if (rawMsg !== finalMsg) {
              msg.metadata.raw = rawMsg;
            }

            msg.payload = finalMsg;
            msg.metadata.content = finalMsg as string;
            this.send(msg);
          } else {
            this.send(msg);
          }
        });
      })
      .catch((e) => {
        this.error(e);
        this.status({
          fill: 'red',
          shape: 'dot',
          text:
            e.name === 'FetchError'
              ? NodeStatusMessage.CLIENT_NO_CONNECTION
              : NodeStatusMessage.CLIENT_WRONG_TOKEN,
        });
      });
    this.on('close', () => {
      botHolder.destroy(token);
    });

    async function resolveMentionsInReactions(
      reaction: MessageReaction,
      msg: RedMessage<DiscordReaction>,
    ): Promise<RedMessage<DiscordReaction>> {
      const res = msg;
      if (config.mentions) {
        return res;
      }

      const guild = (isDmChannel(reaction.message.channel)
        ? reaction.message.guild
        : reaction.message.channel.guild) as Guild;
      const mentionsHandler = new MentionsHandler(guild);
      const rawMsg = res.metadata.message.content;
      const resolvedMsg = await mentionsHandler.handleAll(rawMsg, 'discord');
      res.metadata.message.content = resolvedMsg;
      if (resolvedMsg !== rawMsg) {
        res.metadata.message.raw = rawMsg;
      }
      return res;
    }
  }

  RED.nodes.registerType(
    'discord-get-messages',
    DiscordGetMessagesNodeConstructor,
  );
};

export = nodeInit;
