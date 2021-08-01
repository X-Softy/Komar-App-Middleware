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
