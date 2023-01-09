import { IScenario, IScenarioNode } from '../interfaces/scenario.interface';
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
    if (!this.currentNode.nodes) {
      const error = `The scenario player failed to retrieve node ${selected}`;
      console.error(error);
      throw new Error(error);
    }
    let node = this.currentNode.nodes.find((node) => node.button === selected);
    if (!node) {
      const error = `The scenario player failed to retrieve node ${selected}`;
      console.error(error);
      throw new Error(error);
    }
    if (!node.text) {
      // If the node has no text it considered as the last node in the tree
      // We switch to the node marked as last or to the first
      node = this.scenario.last || this.scenario;
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
    const { nodes } = this.currentNode;
    if (!nodes) {
      return undefined;
    }
    return {
      reply_markup: getButtonsByNodes(nodes),
    };
  }
}

const getButtonsByNodes = (nodes: IScenarioNode[]): InlineKeyboardMarkup => {
  return {
    inline_keyboard: nodes.map((node) => {
      const text = node.button || 'TG API expects text here';
      return [
        {
          text,
          callback_data: text,
        },
      ];
    }),
  };
};
