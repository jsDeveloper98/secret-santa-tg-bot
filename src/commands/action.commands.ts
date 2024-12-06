import { Markup, Telegraf } from "telegraf";

import { Command } from "./command";
import { IBotContext } from "../types/common";
import { escapeMarkdownV2 } from "../utils/common";
import { SharedService } from "../services/shared.service";

export class ActionCommands extends Command {
  private sharedService = SharedService.getInstance();

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.action("add_present", (ctx) => {
      ctx.reply("What kind of present do you want?");
      ctx.session.awaitingPresent = true;
    });

    this.bot.action("remove_from_wish_list", async (ctx) => {
      const user = ctx.from.username;
      const userWishList = this.sharedService.globalWishList.find(
        (req) => req.user === user
      );

      if (userWishList && userWishList.present.length > 0) {
        for (const [index, present] of userWishList.present.entries()) {
          await ctx.replyWithMarkdownV2(
            `${index + 1} 🎁 ${present}`,
            Markup.inlineKeyboard([
              Markup.button.callback(
                "Remove",
                `remove_present_${user}_${index}`
              ),
            ])
          );
        }
      } else {
        ctx.reply("You have no presents in your wish list yet.");
      }
    });

    this.bot.action(/remove_present_(.+)_(\d+)/, (ctx) => {
      const [, user, indexStr] = ctx.match;
      const index = parseInt(indexStr);

      const userIndex = this.sharedService.globalWishList.findIndex(
        (item) => item.user === user
      );

      if (
        userIndex !== -1 &&
        this.sharedService.globalWishList[userIndex].present[index]
      ) {
        const removedPresent = this.sharedService.globalWishList[
          userIndex
        ].present.splice(index, 1);

        this.sharedService.saveGlobalWishList();
        this.sharedService.showOptionsMenu(
          ctx,
          `🎁 Removed "${removedPresent}" from your wish list!`
        );
      } else {
        ctx.reply("❌ Present not found.");
      }
    });

    this.bot.action("view_wish_list", (ctx) => {
      const wishListIsNotEmpty =
        this.sharedService.globalWishList.length !== 0 &&
        this.sharedService.globalWishList.some((item) => {
          return item.present.length > 0;
        });

      if (!wishListIsNotEmpty) {
        this.sharedService.showOptionsMenu(
          ctx,
          "The wish list is currently empty! 🎅 Be the first one!"
        );
      } else {
        const filteredNonEmptyWishLists =
          this.sharedService.globalWishList.filter((item) => {
            return item.present.length;
          });

        const wishListText = filteredNonEmptyWishLists
          .map((req) => {
            const header = `🎅 *${escapeMarkdownV2(
              req.user
            )}* _(${escapeMarkdownV2(req.nickname)})_ wants:\n`;

            const presents = req.present
              .map(
                (present, index) =>
                  `  ${index + 1}. 🎁 ${escapeMarkdownV2(present)}`
              )
              .join("\n");
            return `${header}${presents}`;
          })
          .join("\n\n──────────────\n\n");

        this.sharedService.showOptionsMenu(
          ctx,
          `📜 *Wish List:*\n\n${wishListText}`
        );
      }
    });
  }
}
