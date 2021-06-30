import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthStrategy } from './auth/auth.strategy';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AuthStrategy],
})
export class AppModule {}
