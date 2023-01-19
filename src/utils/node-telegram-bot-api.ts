import {
  InlineKeyboardMarkup,
  SendMessageOptions,
} from 'node-telegram-bot-api';
import { IScenarioFlatNodeJoint } from '../interfaces/scenario.interface';

export const getMessageOptions = (
  buttons?: IScenarioFlatNodeJoint[],
): SendMessageOptions | undefined => {
  if (!buttons) {
    return undefined;
  }
  return {
    reply_markup: getInlineKeyboard(buttons),
  };
};

const getInlineKeyboard = (
  buttons: IScenarioFlatNodeJoint[],
): InlineKeyboardMarkup => {
  return {
    inline_keyboard: buttons.map((button) => {
      const text = button.on || 'TG API expects text here';
      return [
        {
          text,
          callback_data: JSON.stringify(button),
        },
      ];
    }),
  };
};
