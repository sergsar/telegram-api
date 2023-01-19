import {
  InlineKeyboardMarkup,
  SendMessageOptions,
} from 'node-telegram-bot-api';
import { IScenarioFlatButton } from '../interfaces/scenario.interface';

export const getMessageOptions = (
  buttons?: IScenarioFlatButton[],
): SendMessageOptions | undefined => {
  if (!buttons) {
    return undefined;
  }
  return {
    reply_markup: getInlineKeyboard(buttons),
  };
};

const getInlineKeyboard = (
  buttons: IScenarioFlatButton[],
): InlineKeyboardMarkup => {
  return {
    inline_keyboard: buttons.map((button) => {
      const text = button.title || 'TG API expects text here';
      return [
        {
          text,
          callback_data: JSON.stringify(button),
        },
      ];
    }),
  };
};
