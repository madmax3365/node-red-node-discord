import { IRichEmbedArgs } from './interfaces';
import { RichEmbed } from 'discord.js';

export function Embed(args: IRichEmbedArgs): RichEmbed {
  const {
    title,
    description,
    url,
    color,
    timestamp,
    footer,
    thumbnail,
    author,
    attachments,
    field,
    fields,
  } = args;
  const result = new RichEmbed().setAuthor(
    author.name,
    author.icon,
    author.url,
  );
  if (title) {
    result.setTitle(title);
  }
  if (description) {
    result.setDescription(description);
  }
  if (url) {
    result.setURL(url);
  }
  if (color) {
    result.setColor(color);
  }
  if (timestamp) {
    result.setTimestamp(timestamp);
  }
  if (footer) {
    result.setFooter(footer.text, footer.icon);
  }
  if (thumbnail) {
    result.setThumbnail(thumbnail);
  }
  if (field) {
    result.addField(field.name, field.value, field.inline);
  }
  if (fields) {
    result.fields = fields;
  }
  if (attachments) {
    result.attachFiles(attachments);
  }
  return result;
}
