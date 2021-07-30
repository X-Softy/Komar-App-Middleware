import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Room } from './room.model';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@UseGuards(AuthGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get()
  getRooms(): Room[] {
    return this.roomsService.getRooms();
  }
}
