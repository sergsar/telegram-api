import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './controllers/cats.controller';
import { ConfigModule } from '@nestjs/config';
import { TelegramBotService } from './services/telegram-bot.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, CatsController],
  providers: [AppService, TelegramBotService],
})
export class AppModule {}
