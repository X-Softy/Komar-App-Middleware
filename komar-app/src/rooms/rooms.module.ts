import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [AuthModule, CategoriesModule],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
