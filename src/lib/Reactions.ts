import { MessageReaction, User } from 'discord.js';
import Flatted = require('flatted');

export class Reactions {
  private readonly reaction: MessageReaction;
  private readonly user: User;

  constructor(reaction: MessageReaction, user: User) {
    this.reaction = reaction;
    this.user = user;
  }

  get formatPayloadMessage(): string {
    return Flatted.parse(
      Flatted.stringify(new Reactions(this.reaction, this.user)),
    );
  }
}
