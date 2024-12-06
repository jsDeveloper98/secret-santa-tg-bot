import { Telegraf } from "telegraf";

import { Command } from "./commands/command";
import { IBotContext } from "./types/common";
import LocalSession from "telegraf-session-local";
import { OnCommands } from "./commands/on.commands";
import { ConfigService } from "./config/config.service";
import { StartCommands } from "./commands/start.commands";
import { IConfigService } from "./config/config.interface";
import { ActionCommands } from "./commands/action.commands";

class Bot {
  commands: Command[] = [];
  bot: Telegraf<IBotContext>;

  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"));
    this.bot.use(new LocalSession({ database: "sessions.json" }).middleware());
  }

  init() {
    console.log("Initializing bot...");
    this.commands = [
      new StartCommands(this.bot),
      new OnCommands(this.bot),
      new ActionCommands(this.bot),
    ];

    for (const command of this.commands) {
      command.handle();
    }

    this.bot.launch();
  }
}

const bot = new Bot(new ConfigService());
bot.init();
