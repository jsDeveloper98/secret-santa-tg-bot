import fs from "fs";
import path from "path";
import { Markup } from "telegraf";

import { IBotContext } from "../types/common";

export interface PresentRequest {
  user: string;
  nickname: string;
  present: string[];
}

const dbPath = path.join(__dirname, "../../db.json");

export class SharedService {
  private static instance: SharedService;
  public globalWishList: PresentRequest[] = [];

  private constructor() {
    this.loadGlobalWishList();
  }

  public showOptionsMenu(ctx: IBotContext, message: string): void {
    ctx.reply(
      message,
      Markup.inlineKeyboard([
        Markup.button.callback("🎁 Add Present Request", "add_present"),
        Markup.button.callback("📜 View Present Requests", "view_wish_list"),
        Markup.button.callback(
          "📝 Remove From Wish List",
          "remove_from_wish_list"
        ),
      ])
    );
  }

  public static getInstance(): SharedService {
    if (!SharedService.instance) {
      SharedService.instance = new SharedService();
    }
    return SharedService.instance;
  }

  private loadGlobalWishList(): void {
    try {
      if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, "utf-8");
        this.globalWishList = JSON.parse(data) as PresentRequest[];
        console.log("Loaded global wish list:", this.globalWishList);
      } else {
        console.log("No sessions file found. Starting with an empty list.");
      }
    } catch (error) {
      console.error("Error loading global wish list:", error);
    }
  }

  public saveGlobalWishList(): void {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(this.globalWishList, null, 2));
      console.log("Global wish list saved.");
    } catch (error) {
      console.error("Error saving global wish list:", error);
    }
  }
}
