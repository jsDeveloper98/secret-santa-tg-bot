import { Telegraf } from "telegraf";

import { Command } from "./command";
import { IBotContext, ICTX } from "../types/common";
import { SharedService } from "../services/shared.service";
import {
  getUser,
  showNicknamePrompt,
  isNicknameAvailable,
} from "../utils/common";

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
    if (!isNicknameAvailable(ctx)) {
      showNicknamePrompt(ctx);
    } else {
      const textWithoutDots = ctx.message.text.replace(/\./g, "");
      this.sharedService.globalWishList.forEach((item) => {
        if (item.user === getUser(ctx)) {
          item.present.push(textWithoutDots);
        }
      });

      this.sharedService.saveGlobalWishList();
      ctx.session.awaitingPresent = false;
      this.sharedService.showOptionsMenu(
        ctx,
        `Got it! 🎁 I'll add "${textWithoutDots}" to the list. \nChoose an option:`
      );
    }
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
        nickname,
        present: [],
        user: getUser(ctx),
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
