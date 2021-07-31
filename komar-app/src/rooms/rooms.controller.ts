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
import { User as Userable } from 'src/utils/user';
import { User } from 'src/utils/user.decorator';
import { AddCommentDto } from './dto/add-comment.dto';
import { CreateRoomDto } from './dto/create-room.dto';
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
  getRoomsOfLoggedInUser(@User() user: Userable): Room[] {
    return this.roomsService.getRoomsByUserId(user.email);
  }

  @Get('/details/:id')
  getRoomDetailsById(@Param('id') roomId: string): Room {
    return this.roomsService.getRoomDetailsById(roomId);
  }

  @Post()
  createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @User() user: Userable,
  ): void {
    return this.roomsService.createRoom(createRoomDto, user.email);
  }

  @Delete('/:id')
  deleteRoomById(@Param('id') roomId: string, @User() user: Userable): void {
    return this.roomsService.deleteRoomById(roomId, user.email);
  }

  @Patch('/join/:id')
  joinUserToRoom(@Param('id') roomId: string, @User() user: Userable): void {
    return this.roomsService.joinUserToRoom(roomId, user.email);
  }

  @Patch('/unjoin/:id')
  unjoinUserFromRoom(@Param('id') roomId: string, @User() user: Userable) {
    return this.roomsService.unjoinUserFromRoom(roomId, user.email);
  }

  @Patch('/comment/:id')
  addCommentToRoom(
    @Param('id') roomId: string,
    @Body() addCommentDto: AddCommentDto,
    @User() user: Userable,
  ): void {
    return this.roomsService.addCommentToRoom(
      roomId,
      addCommentDto,
      user.email,
    );
  }
}
