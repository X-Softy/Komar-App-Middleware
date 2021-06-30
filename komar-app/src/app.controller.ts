import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

@Controller('hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/world')
  @UseGuards(AuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
