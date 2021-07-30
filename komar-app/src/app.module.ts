import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { RoomsModule } from './rooms/rooms.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CategoriesModule, RoomsModule, AuthModule],
})
export class AppModule {}
