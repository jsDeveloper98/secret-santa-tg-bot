import { Telegraf } from "telegraf";

import { Command } from "./command";
import { IBotContext } from "../types/common";
import { SharedService } from "../services/shared.service";
import { isNicknameAvailable, showNicknamePrompt } from "../utils/common";

export class StartCommands extends Command {
  private sharedService = SharedService.getInstance();

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.start((ctx) => {
      if (!isNicknameAvailable(ctx)) {
        showNicknamePrompt(ctx);
      } else {
        this.sharedService.showOptionsMenu(ctx, "Choose an option:");
      }
    });
  }
}
