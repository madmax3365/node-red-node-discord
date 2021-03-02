import { Bot } from '../types';
import { Client } from 'discord.js';

export class BotHolder {
  private bots = new Map<string, Bot>();

  public async getBot(token: string): Promise<Client> {
    const bot = this.bots.get(token);
    if (bot) {
      bot.refs++;
      return bot;
    }
    const newBot = new Client() as Bot;
    newBot.refs = 0;
    await newBot.login(token);
    this.bots.set(token, newBot);
    return newBot;
  }

  public destroy(token: string): void {
    const bot = this.bots.get(token);
    if (bot) {
      if (bot.refs > 1) {
        bot.refs--;
      } else {
        try {
          bot.destroy();
          this.bots.delete(token);
        } catch {
          return;
        }
      }
    }
  }
}
