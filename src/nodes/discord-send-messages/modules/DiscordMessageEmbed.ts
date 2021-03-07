import { MessageEmbed } from 'discord.js';
import { RichEmbedArgs } from './types';

export class DiscordMessageEmbed extends MessageEmbed {
  constructor(data: RichEmbedArgs) {
    super();
    this.type = data.type ?? 'rich';

    this.setTimestamp(data.timestamp).attachFiles(data.attachments ?? []);

    if (data.title) {
      this.setTitle(data.title);
    }

    if (data.description) {
      this.setDescription(data.description);
    }

    if (data.author) {
      this.setAuthor(data.author.name, data.author.iconUrl, data.author.url);
    }

    if (data.url) {
      this.setURL(data.url);
    }
    if (data.color) {
      this.setColor(data.color);
    }

    if (data.provider) {
      this.provider = data.provider;
    }

    if (data.footer) {
      this.setFooter(data.footer.text, data.footer.icon);
    }
    if (data.thumbnail) {
      this.setThumbnail(data.thumbnail);
    }

    if (data.field) {
      this.addField(data.field.name, data.field.value, data.field.inline);
    }

    if (data.fields) {
      this.addFields(data.fields);
    }
  }
}
