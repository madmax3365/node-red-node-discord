import { Client, MessageAttachment, MessageEmbed } from 'discord.js';
import { RichEmbedArgs } from './types';
import { MentionsHandler } from '../../shared/lib/MentionsHandler';

export class RichMessage extends MessageEmbed {
  constructor(data: RichEmbedArgs, client: Client) {
    super();
    const mh = new MentionsHandler(client);
    this.setTitle(mh.toDiscord(data.title ?? null))
      .setDescription(mh.toDiscord(data.description ?? null))
      .setTimestamp(data.timestamp)
      .attachFiles(
        data.attachments?.map((a) => new MessageAttachment(a.src, a.name)) ??
          [],
      );

    if (data.author) {
      this.setAuthor(data.author.name, data.author.iconUrl, data.author.url);
    }

    if (data.url) {
      this.setURL(data.url);
    }
    if (data.color) {
      this.setColor(data.color);
    }

    if (data.footer) {
      this.setFooter(mh.toDiscord(data.footer.text), data.footer.icon);
    }
    if (data.thumbnail) {
      this.setThumbnail(data.thumbnail);
    }

    if (data.field) {
      this.addField(
        data.field.name,
        mh.toDiscord(data.field.value),
        data.field.inline,
      );
    }

    if (data.fields) {
      this.addFields(
        data.fields.map((el) => {
          el.value = mh.toDiscord(el.value) ?? '';
          return el;
        }),
      );
    }
  }
}
