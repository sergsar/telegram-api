import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { Env } from '../classes/env';
import { ScenarioService } from './scenario-service';
import { ScenarioPlayer } from '../classes/scenario-player';

@Injectable()
export class TelegramBotService implements OnApplicationBootstrap {
  constructor(private scenarioService: ScenarioService) {}

  async onApplicationBootstrap(): Promise<void> {
    const bot = new TelegramBot(Env.process('TG_ACCESS_TOKEN'), {
      polling: true,
    });

    let player: ScenarioPlayer;

    bot.on('text', async (msg) => {
      const scenario = await this.scenarioService.getScenario();
      player = new ScenarioPlayer(scenario);

      player.reset();

      await bot.sendMessage(
        msg.chat.id,
        player.getMessage(),
        player.getMessageOptions(),
      );
    });

    bot.on('callback_query', async (callbackQuery) => {
      const { message, data } = callbackQuery;
      if (!(message && data)) {
        const error = 'Bot failed to resolve next step';
        console.error(error);
        throw new Error(error);
      }

      await bot.editMessageText(message.text || '', {
        message_id: message.message_id,
        chat_id: message.chat.id,
      });

      await bot.sendMessage(message.chat.id, `"${data}"`);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      player.setNextNode(data);

      await bot.sendMessage(
        message.chat.id,
        player.getMessage(),
        player.getMessageOptions(),
      );
    });
  }
}
