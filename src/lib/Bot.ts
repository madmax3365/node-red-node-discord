import { Client } from 'discord.js';
import { IBot } from './interfaces';

export class Bot {
  private bots: Map<string, IBot>;

  constructor() {
    this.bots = new Map();
  }

  /**
   * Get bot. Returns from Map if bot already created.
   */
  public get(token: string): Promise<IBot> {
    return new Promise((resolve, reject) => {
      const fromMem = this.bots.get(token);
      const bot = fromMem || (new Client() as IBot);
      bot.numReferences = (bot.numReferences || 0) + 1;
      if (fromMem) {
        resolve(bot);
      } else {
        this.bots.set(token, bot);
        bot
          .login(token)
          .then(() => resolve(bot))
          .catch((err: Error) => reject(err));
      }
    });
  }

  /**
   * Destroy bot connection
   */
  public destroy(bot: IBot): void {
    if (bot.numReferences === 0) {
      try {
        bot.destroy();
      } catch (e) {
        return;
      }
      for (const i of this.bots.entries()) {
        if (i[1] === bot) {
          this.bots.delete(i[0]);
        }
      }
    }
  }
}
