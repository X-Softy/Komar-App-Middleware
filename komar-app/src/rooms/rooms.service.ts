import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { FirebaseFactory } from 'src/utils/firebase.factory';
import { AddCommentDto } from './dto/add-comment.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomBrief, RoomDetailed } from './room.model';

@Injectable()
export class RoomsService {
  private firestore = FirebaseFactory.shared.app.firestore();

  constructor(private categoriesService: CategoriesService) {}

  async getRoomsByCategoryId(categoryId: string): Promise<RoomBrief[]> {
    const categories = await this.categoriesService.getAllCategories();
    const categoryExists = categories.some(
      (category) => category.id === categoryId,
    );
    if (!categoryExists) {
      throw new NotAcceptableException('invalid category ID was passed');
    }

    const roomDocs = await this.firestore
      .collection('rooms')
      .where('categoryId', '==', categoryId)
      .get();

    const rooms: RoomBrief[] = [];
    roomDocs.forEach((roomDoc) => {
      const room: RoomBrief = {
        id: roomDoc.id,
        title: roomDoc.data().title,
      };
      rooms.push(room);
    });
    return rooms;
  }

  async getRoomDetailsById(roomId: string): Promise<RoomDetailed> {
    const roomDoc = await this.firestore.collection('rooms').doc(roomId).get();

    if (!roomDoc.exists) {
      throw new NotFoundException();
    }

    const roomDocData = roomDoc.data();

    const room: RoomDetailed = {
      id: roomDoc.id,
      title: roomDocData.title,
      categoryId: roomDocData.categoryId,
      creatorUserId: roomDocData.creatorUserId,
      joinedUserIds: roomDocData.joinedUserIds,
      description: roomDocData.description,
      comments: roomDocData.comments,
    };

    return room;
  }

  async getRoomsByUserId(userId: string): Promise<RoomBrief[]> {
    const createdRoomDocs = await this.firestore
      .collection('rooms')
      .where('creatorUserId', '==', userId)
      .get();

    const joinedRoomDocs = await this.firestore
      .collection('rooms')
      .where('joinedUserIds', 'array-contains', userId)
      .get();

    const rooms: RoomBrief[] = [];

    createdRoomDocs.forEach((roomDoc) => {
      const room: RoomBrief = {
        id: roomDoc.id,
        title: roomDoc.data().title,
      };
      console.log(roomDoc.data());
      rooms.push(room);
    });

    joinedRoomDocs.forEach((roomDoc) => {
      const room: RoomBrief = {
        id: roomDoc.id,
        title: roomDoc.data().title,
      };
      console.log(roomDoc.data());
      rooms.push(room);
    });

    return rooms;
  }

  async createRoom(
    createRoomDto: CreateRoomDto,
    creatorUserId: string,
  ): Promise<void> {
    const { categoryId, title, description } = createRoomDto;

    const categories = await this.categoriesService.getAllCategories();
    const categoryExists = categories.some(
      (category) => category.id === categoryId,
    );
    if (!categoryExists) {
      throw new NotAcceptableException('invalid category ID was passed');
    }

    const roomDoc = await this.firestore.collection('rooms').doc();

    await roomDoc.set({
      creatorUserId: creatorUserId,
      joinedUserIds: [],
      categoryId: categoryId,
      title: title,
      description: description,
      comments: [],
    });
  }

  async deleteRoomById(roomId: string, userId: string): Promise<void> {
    const roomDoc = this.firestore.collection('rooms').doc(roomId);
    const roomDocSnapshot = await roomDoc.get();
    const roomDocData = roomDocSnapshot.data();

    const userIsCreator = roomDocData.creatorUserId === userId;
    if (!userIsCreator) {
      throw new NotAcceptableException(
        'user is not creator and can not delete room',
      );
    }

    roomDoc.delete();
  }

  async joinUserToRoom(roomId: string, userId: string): Promise<void> {
    const roomDoc = this.firestore.collection('rooms').doc(roomId);
    const roomDocSnapshot = await roomDoc.get();
    const roomDocData = roomDocSnapshot.data();

    const userIsCreator = roomDocData.creatorUserId === userId;
    if (userIsCreator) {
      throw new NotAcceptableException('user is creator and can not be joined');
    }

    const userIsJoined = roomDocData.joinedUserIds.includes(userId);
    if (userIsJoined) {
      throw new NotAcceptableException('user is already joined');
    }

    const joinedUserIds = roomDocData.joinedUserIds;
    joinedUserIds.push(userId);

    roomDoc.update({
      joinedUserIds: joinedUserIds,
    });
  }

  async unjoinUserFromRoom(roomId: string, userId: string): Promise<void> {
    const roomDoc = this.firestore.collection('rooms').doc(roomId);
    const roomDocSnapshot = await roomDoc.get();
    const roomDocData = roomDocSnapshot.data();

    const userIsCreator = roomDocData.creatorUserId === userId;
    if (userIsCreator) {
      throw new NotAcceptableException(
        'user is creator and can not be unjoined',
      );
    }

    const userIsJoined = roomDocData.joinedUserIds.includes(userId);
    if (!userIsJoined) {
      throw new NotAcceptableException('user is not joined anyway');
    }

    const joinedUserIds = roomDocData.joinedUserIds.filter(
      (joinedUserId) => joinedUserId !== userId,
    );

    roomDoc.update({
      joinedUserIds: joinedUserIds,
    });
  }

  async addCommentToRoom(
    roomId: string,
    addCommentDto: AddCommentDto,
    userId: string,
  ): Promise<void> {
    const roomDoc = this.firestore.collection('rooms').doc(roomId);
    const roomDocSnapshot = await roomDoc.get();
    const roomDocData = roomDocSnapshot.data();

    const userIsCreator = roomDocData.creatorUserId === userId;
    if (!userIsCreator) {
      const userIsJoined = roomDocData.joinedUserIds.includes(userId);
      if (!userIsJoined) {
        throw new NotAcceptableException(
          'user must be creator or joined user to comment',
        );
      }
    }

    const comments = roomDocData.comments;
    comments.push({
      userId: userId,
      comment: addCommentDto.comment,
    });

    roomDoc.update({
      comments: comments,
    });
  }
}
