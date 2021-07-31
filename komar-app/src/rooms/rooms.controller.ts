import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/utils/user.decorator';
import { Room } from './room.model';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@UseGuards(AuthGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get('/category/:id')
  getRoomsByCategoryId(@Param('id') categoryId: string): Room[] {
    return this.roomsService.getRoomsByCategoryId(categoryId);
  }

  @Get('/user')
  getRoomsOfLoggedInUser(@User() user): Room[] {
    return this.roomsService.getRoomsByUserId(user.email);
  }

  @Get('/details/:id')
  getRoomDetailsById(@Param('id') roomId: string): Room {
    return this.roomsService.getRoomDetailsById(roomId);
  }

  @Post()
  createRoom(@User() user, @Body() body) {
    console.log(user, body);
  }

  @Delete('/:id')
  deleteRoomById(@User() user) {
    console.log(user);
  }

  @Patch('/join/:id')
  joinUser(@User() user) {
    console.log(user);
  }

  @Patch('/unjoin/:id')
  unjoinUser(@User() user) {
    console.log(user);
  }

  @Patch('/comment/:id')
  addComment(@User() user, @Body() body) {
    console.log(user, body);
  }
}
