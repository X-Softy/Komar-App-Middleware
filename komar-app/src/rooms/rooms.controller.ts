import {
  Body,
  Controller,
  Delete,
  Get,
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
  getRoomsByCategoryId(): Room[] {
    return this.roomsService.getRooms();
  }

  @Get('/details/:id')
  getRoomDetailsById(): Room {
    return this.roomsService.getRoom();
  }

  @Get('/user')
  getRoomsOfLoggedInUser(@User() user) {
    console.log(user);
    return this.roomsService.getRooms();
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
