export interface Room {
  id: string;
  categoryId: string;
  creator: string;
  joinedUserIds: string[];
  title: string;
  description: string;
  comments: Comment[];
}

export interface Comment {
  userId: string;
  comment: string;
}
