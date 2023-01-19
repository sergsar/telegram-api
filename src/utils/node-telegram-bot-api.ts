import {
  InlineKeyboardMarkup,
  SendMessageOptions,
} from 'node-telegram-bot-api';
import { IScenarioFlatNodeContent } from '../interfaces/scenario.interface';

export const getMessageOptions = (
  buttons?: IScenarioFlatNodeContent[],
): SendMessageOptions | undefined => {
  if (!buttons) {
    return undefined;
  }
  return {
    reply_markup: getInlineKeyboard(buttons),
  };
};

const getInlineKeyboard = (
  buttons: IScenarioFlatNodeContent[],
): InlineKeyboardMarkup => {
  return {
    inline_keyboard: buttons.map((button) => {
      const text = button.name || 'TG API expects text here';
      return [
        {
          text,
          callback_data: JSON.stringify(button),
        },
      ];
    }),
  };
};
