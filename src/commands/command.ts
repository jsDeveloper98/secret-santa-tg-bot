import { Telegraf } from "telegraf";

import { IBotContext } from "../types/common";

export class Command {
  bot: Telegraf<IBotContext>;

  constructor(bot: Telegraf<IBotContext>) {
    this.bot = bot;
  }

  handle(): void {}
}
