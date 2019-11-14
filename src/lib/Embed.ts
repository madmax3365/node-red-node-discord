import { RichEmbed } from 'discord.js';

import { IRichEmbedArgs } from './interfaces';

export function Embed(args: IRichEmbedArgs): RichEmbed {
  const { title, author, text, description, attachments } = args;
  const result = new RichEmbed()
    .setColor('#0099ff')
    .setAuthor(
      author.name,
      author.icon || 'https://cdn.discordapp.com/embed/avatars/0.png',
    )
    .setTimestamp();
  if (title) {
    result.setTitle(title);
  }
  if (description) {
    result.setDescription(description);
  }
  if (text) {
    result.addField('Message', text);
  }
  if (attachments) {
    result.attachFiles(attachments);
  }
  return result;
}
