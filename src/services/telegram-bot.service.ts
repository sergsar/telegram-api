import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { Env } from '../classes/env';
import { ScenarioService } from './scenario-service';
import { ScenarioPlayer } from '../classes/scenario-player';
import { getMessageOptions } from '../utils/node-telegram-bot-api';
import { IScenarioFlatNodeContent } from '../interfaces/scenario.interface';

@Injectable()
export class TelegramBotService implements OnApplicationBootstrap {
  constructor(private scenarioService: ScenarioService) {}

  async onApplicationBootstrap(): Promise<void> {
    const bot = new TelegramBot(Env.process('TG_ACCESS_TOKEN'), {
      polling: true,
    });

    bot.on('text', async (msg) => {
      const scenario = await this.scenarioService.getScenario();
      const player = new ScenarioPlayer(scenario);
      const content = player.getFlatNodeContent(0);
      await bot.sendMessage(
        msg.chat.id,
        player.getMessage(0),
        getMessageOptions(content),
      );
    });

    bot.on('callback_query', async (callbackQuery) => {
      const scenario = await this.scenarioService.getScenario();
      const player = new ScenarioPlayer(scenario);

      const { message, data } = callbackQuery;
      if (!(message && data)) {
        const error = 'Bot failed to resolve next step';
        console.error(error);
        throw new Error(error);
      }

      const contentItem: IScenarioFlatNodeContent = JSON.parse(data);

      await bot.editMessageText(message.text || '', {
        message_id: message.message_id,
        chat_id: message.chat.id,
      });

      await bot.sendMessage(message.chat.id, `"${contentItem.name}"`);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const content = player.getFlatNodeContent(contentItem.next);

      await bot.sendMessage(
        message.chat.id,
        player.getMessage(contentItem.next),
        getMessageOptions(content),
      );
    });
  }
}
