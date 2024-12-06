import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";

export interface ISessionData {
  nickname: string;
  awaitingNickname: boolean;
  awaitingPresent: boolean;
}

export interface IBotContext extends Context<Update> {
  session: ISessionData;
}

export type ICTX = NarrowedContext<
  IBotContext,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }
>;
