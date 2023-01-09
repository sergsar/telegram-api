import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './controllers/cats.controller';
import { ConfigModule } from '@nestjs/config';
import { TelegramBotService } from './services/telegram-bot.service';
import { AwsCellarService } from './services/aws-cellar.service';
import { FILE_STORAGE_TOKEN } from './consts/file-storage-token';
import { ScenarioService } from './services/scenario-service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, CatsController],
  providers: [
    AppService,
    TelegramBotService,
    ScenarioService,
    { provide: FILE_STORAGE_TOKEN, useClass: AwsCellarService },
  ],
})
export class AppModule {}
