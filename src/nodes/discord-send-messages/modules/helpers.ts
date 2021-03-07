import { FormattedMessageArgs, NodeFlowMessage } from './types';
import { DiscordMessageEmbed } from './DiscordMessageEmbed';
import { Guild } from 'discord.js';
import { MentionsHandler } from '../../shared/lib/MentionsHandler';

export function prepareMsg(input: NodeFlowMessage): FormattedMessageArgs {
  const res = {} as FormattedMessageArgs;

  const msg = input.msg;

  if (msg) {
    res.content = msg;
  }
  if (input.embed) {
    const embed = new DiscordMessageEmbed(input.embed);
    if (!embed.files && input.attachments) {
      embed.attachFiles(input.attachments);
    }
    res[msg ? 'additions' : 'content'] = embed;
  } else if (input.attachments) {
    res[msg ? 'additions' : 'content'] = { files: input.attachments };
  }

  return res;
}

export async function prepareMessageWithMentions(
  input: NodeFlowMessage,
  guild: Guild,
): Promise<FormattedMessageArgs> {
  const msgArgs = prepareMsg(input);
  const { content, additions } = msgArgs;
  const mh = new MentionsHandler(guild);
  if (typeof content === 'string') {
    msgArgs.content = await mh.handleAll(content, 'flow');
    if (additions instanceof DiscordMessageEmbed && input.embed) {
      const preparedData = await mh.handleEmbed(input.embed, 'flow');
      msgArgs.additions = new DiscordMessageEmbed(preparedData);
    }
  } else if (content instanceof DiscordMessageEmbed && input.embed) {
    const preparedData = await mh.handleEmbed(input.embed, 'flow');
    msgArgs.content = new DiscordMessageEmbed(preparedData);
  }

  return msgArgs;
}
