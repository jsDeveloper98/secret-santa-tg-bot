import { Telegraf } from "telegraf";

import { Command } from "./command";
import { IBotContext, ICTX } from "../types/common";
import { SharedService } from "../services/shared.service";

interface PresentRequest {
  user: string;
  nickname: string;
  present: string[];
}

export class OnCommands extends Command {
  private sharedService = SharedService.getInstance();

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  private async handlePresentRequest(ctx: ICTX): Promise<void> {
    this.sharedService.globalWishList.forEach((item) => {
      if (item.user === ctx.from.username) {
        item.present.push(ctx.message.text);
      }
    });

    this.sharedService.saveGlobalWishList();
    ctx.session.awaitingPresent = false;
    this.sharedService.showOptionsMenu(
      ctx,
      `Got it! 🎁 I'll add "${ctx.message.text}" to the list. \nChoose an option:`
    );
  }

  private handleNicknameRequest(ctx: ICTX): void {
    let userExists = false;
    this.sharedService.globalWishList.forEach((item) => {
      if (item.user === ctx.from.username) {
        userExists = true;
      }
    });

    const nickname = ctx.message.text;
    if (!userExists) {
      const newUser: PresentRequest = {
        user: ctx.from.username || ctx.from.first_name || "Unknown User",
        nickname,
        present: [],
      };
      this.sharedService.globalWishList.push(newUser);
    }

    this.sharedService.saveGlobalWishList();
    ctx.session.awaitingNickname = false;
    ctx.session.nickname = nickname;
    this.sharedService.showOptionsMenu(
      ctx,
      `Thanks, ${nickname}! 🎅\nChoose an option:`
    );
  }

  handle(): void {
    this.bot.on("text", async (ctx) => {
      if (ctx.session.awaitingNickname) {
        this.handleNicknameRequest(ctx);
      } else if (ctx.session.awaitingPresent) {
        this.handlePresentRequest(ctx);
      }
    });
  }
}
