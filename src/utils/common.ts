export const escapeMarkdownV2 = (text: string): string => {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
};

export const getUser = (ctx: any): string => {
  return ctx.from.username || ctx.from.first_name || `user_${ctx.from.id}`;
};

export const isNicknameAvailable = (ctx: any): boolean =>
  !!ctx.session.nickname;

export const showNicknamePrompt = (ctx: any): void => {
  const username = ctx.from.username || ctx.from.first_name || "Unknown User";

  ctx.reply(`Hi ${username}! 🎅\nPlease set your nickname by typing it below:`);
  ctx.session.awaitingNickname = true;
};
