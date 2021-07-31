import { Injectable } from '@nestjs/common';
import { Room } from './room.model';

@Injectable()
export class RoomsService {
  private rooms: Room[] = [
    {
      id: '0',
      categoryId: '0',
      creator: 'gkrat17@freeuni.edu.ge',
      joinedUserIds: ['lgela17@freeuni.edu.ge'],
      title: 'Title 0',
      description: 'Description 0',
      comments: [
        {
          userId: 'gkrat17@freeuni.edu.ge',
          comment: 'Comment 0',
        },
        {
          userId: 'lgela17@freeuni.edu.ge',
          comment: 'Comment 1',
        },
      ],
    },
  ];

  getRoomsByCategoryId(categoryId: string): Room[] {
    console.log(categoryId);
    return this.rooms;
  }

  getRoomDetailsById(roomId: string): Room {
    console.log(roomId);
    return this.rooms[0];
  }

  getRoomsByUserId(userId: string): Room[] {
    console.log(userId);
    return this.rooms;
  }
}
