import { AddCommentDto } from './dto/add-comment.dto';
import { CreateRoomDto } from './dto/create-room.dto';

export interface RoomBrief {
  id: string;
  title: string;
}

export interface RoomDetailed extends RoomBrief {
  categoryId: string;
  creatorUserId: string;
  joinedUserIds: string[];
  description: string;
  comments: Comment[];
}

export interface Comment {
  userId: string;
  comment: string;
}

export const converter = {
  toFirestoreDetailed(createRoomDto: CreateRoomDto, creatorUserId: string) {
    const { categoryId, title, description } = createRoomDto;
    return {
      creatorUserId,
      joinedUserIds: [],
      categoryId,
      title,
      description,
      comments: [],
    };
  },

  fromFirestoreBriefList(
    snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  ): RoomBrief[] {
    const rooms: RoomBrief[] = [];
    snapshot.forEach((roomDoc) => {
      const room: RoomBrief = this.fromFirestoreBrief(
        roomDoc.id,
        roomDoc.data(),
      );
      rooms.push(room);
    });
    return rooms;
  },

  fromFirestoreBrief(roomId: string, roomDocData): RoomBrief {
    return {
      id: roomId,
      title: roomDocData.title,
    };
  },

  fromFirestoreDetailed(roomId: string, roomDocData): RoomDetailed {
    return {
      id: roomId,
      title: roomDocData.title,
      categoryId: roomDocData.categoryId,
      creatorUserId: roomDocData.creatorUserId,
      joinedUserIds: roomDocData.joinedUserIds,
      description: roomDocData.description,
      comments: roomDocData.comments,
    };
  },

  fromFirestoreComment(addCommentDto: AddCommentDto, userId: string): Comment {
    return {
      userId,
      comment: addCommentDto.comment,
    };
  },
};
