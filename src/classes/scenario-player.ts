import {
  IScenario,
  IScenarioButton,
  IScenarioNode,
} from '../interfaces/scenario.interface';
import TelegramBot, {
  EditMessageTextOptions,
  InlineKeyboardMarkup,
  SendMessageOptions,
} from 'node-telegram-bot-api';

export class ScenarioPlayer {
  private currentNode: IScenarioNode;

  constructor(private readonly scenario: IScenario) {
    this.currentNode = scenario;
  }

  reset(): void {
    this.currentNode = this.scenario;
  }

  setNextNode(selected: string): void {
    if (!this.currentNode.buttons) {
      const error = `The scenario player failed to retrieve next node buttons by selected "${selected}"`;
      console.error(error);
      throw new Error(error);
    }
    let node = this.currentNode.buttons.find(
      (button) => button.title === selected,
    )?.next;

    if (!node) {
      // If there are no next node considered the last node,
      // and we are moving up to the nearest exit node in the tree (TODO)
      // if we have no exit we are moving to the root
      node = this.scenario.exit || this.scenario;
    }

    this.currentNode = node;
  }

  getMessage(): string {
    return (
      this.currentNode.text ||
      'Please keep in mind the telegram API expects text here'
    );
  }

  getEditMessageOptions(message: TelegramBot.Message): EditMessageTextOptions {
    return {
      chat_id: message.chat.id,
      message_id: message.message_id,
      ...(this.getMessageOptions() as InlineKeyboardMarkup),
    };
  }

  getMessageOptions(): SendMessageOptions | undefined {
    const { buttons } = this.currentNode;
    if (!buttons) {
      return undefined;
    }
    return {
      reply_markup: getInlineKeyboard(buttons),
    };
  }
}

const getInlineKeyboard = (
  buttons: IScenarioButton[],
): InlineKeyboardMarkup => {
  return {
    inline_keyboard: buttons.map((button) => {
      const text = button.title || 'TG API expects text here';
      return [
        {
          text,
          callback_data: text,
        },
      ];
    }),
  };
};
