import { Telegraf } from "telegraf";

import { Command } from "./command";
import { IBotContext } from "../types/common";
import { SharedService } from "../services/shared.service";

export class StartCommands extends Command {
  private sharedService = SharedService.getInstance();

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.start((ctx) => {
      const username =
        ctx.from.username || ctx.from.first_name || "Unknown User";

      if (!ctx.session.nickname) {
        ctx.reply(
          `Hi ${username}! 🎅\nPlease set your nickname by typing it below:`
        );
        ctx.session.awaitingNickname = true;
      } else {
        this.sharedService.showOptionsMenu(ctx, "Choose an option:");
      }
    });
  }
}
