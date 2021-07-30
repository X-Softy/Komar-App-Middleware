import { Module } from '@nestjs/common';
import { AuthStrategy } from './auth.strategy';

@Module({
  providers: [AuthStrategy],
  exports: [AuthStrategy],
})
export class AuthModule {}
