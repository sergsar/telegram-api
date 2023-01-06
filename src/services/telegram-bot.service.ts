import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { Env } from '../classes/env';

@Injectable()
export class TelegramBotService implements OnApplicationBootstrap {
  onApplicationBootstrap(): void {
    const bot = new TelegramBot(Env.process('TG_ACCESS_TOKEN'), {
      polling: true,
    });
    bot.on('message', (msg) => {
      bot.sendMessage(msg.chat.id, `Hello! Nice message "${msg.text}"`);
    });
  }
}
