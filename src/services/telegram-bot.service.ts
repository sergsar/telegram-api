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
      for (let i = 1; i < 99; i++) {
        // workaround to clear the chat
        bot
          .deleteMessage(msg.chat.id, String(msg.message_id - i))
          .catch(() => void 0);
      }

      const scenario = await this.scenarioService.getScenario();
      player = new ScenarioPlayer(scenario);

      player.reset();

      await bot.sendMessage(
        msg.chat.id,
        player.getMessage(),
        player.getMessageOptions(),
      );
    });

    bot.on('callback_query', (callbackQuery) => {
      const { message, data } = callbackQuery;
      if (!(message && data)) {
        const error = 'Bot failed to resolve next step';
        console.error(error);
        throw new Error(error);
      }

      player.setNextNode(data);

      bot.editMessageText(
        player.getMessage(),
        player.getEditMessageOptions(message),
      );
    });
  }
}
