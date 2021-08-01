import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { FirebaseFactory } from 'src/utils/firebase.factory';
import { AddCommentDto } from './dto/add-comment.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomBrief, RoomDetailed, Comment, converter } from './room.model';

@Injectable()
export class RoomsService {
  private firestore = FirebaseFactory.shared.app.firestore();
  private readonly COLLECTION_NAME = 'rooms';

  constructor(private categoriesService: CategoriesService) {}

  async getRoomsByCategoryId(categoryId: string): Promise<RoomBrief[]> {
    const categoryExists = await this.categoryExists(categoryId);
    if (!categoryExists) {
      throw new NotAcceptableException('invalid category ID was passed');
    }

    const roomDocs = await this.firestore
      .collection(this.COLLECTION_NAME)
      .where('categoryId', '==', categoryId)
      .get();

    return converter.fromFirestoreBriefList(roomDocs);
  }

  async getRoomDetailsById(roomId: string): Promise<RoomDetailed> {
    const roomDoc = await this.firestore
      .collection(this.COLLECTION_NAME)
      .doc(roomId)
      .get();

    if (!roomDoc.exists) {
      throw new NotFoundException();
    }

    return converter.fromFirestoreDetailed(roomId, roomDoc.data());
  }

  async getRoomsByUserId(userId: string): Promise<RoomBrief[]> {
    const createdRoomDocs = await this.firestore
      .collection(this.COLLECTION_NAME)
      .where('creatorUserId', '==', userId)
      .get();

    const joinedRoomDocs = await this.firestore
      .collection(this.COLLECTION_NAME)
      .where('joinedUserIds', 'array-contains', userId)
      .get();

    return converter
      .fromFirestoreBriefList(createdRoomDocs)
      .concat(converter.fromFirestoreBriefList(joinedRoomDocs));
  }

  async createRoom(
    createRoomDto: CreateRoomDto,
    creatorUserId: string,
  ): Promise<void> {
    const categoryExists = await this.categoryExists(createRoomDto.categoryId);
    if (!categoryExists) {
      throw new NotAcceptableException('invalid category ID was passed');
    }

    const document = await this.firestore
      .collection(this.COLLECTION_NAME)
      .doc();

    const room = converter.toFirestoreDetailed(createRoomDto, creatorUserId);
    await document.set(room);
  }

  async deleteRoomById(roomId: string, userId: string): Promise<void> {
    const { document, userIsCreator } = await this.convertParams(
      roomId,
      userId,
    );

    if (!userIsCreator()) {
      throw new NotAcceptableException(
        'user is not creator and can not delete room',
      );
    }

    document.delete();
  }

  async joinUserToRoom(roomId: string, userId: string): Promise<void> {
    const { document, data, userIsCreator, userIsJoined } =
      await this.convertParams(roomId, userId);

    if (userIsCreator() || userIsJoined()) {
      throw new NotAcceptableException('user is creator or is already joined');
    }

    const joinedUserIds = data.joinedUserIds;
    joinedUserIds.push(userId);

    document.update({
      joinedUserIds: joinedUserIds,
    });
  }

  async unjoinUserFromRoom(roomId: string, userId: string): Promise<void> {
    const { document, data, userIsCreator, userIsJoined } =
      await this.convertParams(roomId, userId);

    if (userIsCreator() || !userIsJoined()) {
      throw new NotAcceptableException('user is creator or is not joined');
    }

    const joinedUserIds = data.joinedUserIds.filter(
      (joinedUserId) => joinedUserId !== userId,
    );

    document.update({
      joinedUserIds: joinedUserIds,
    });
  }

  async addCommentToRoom(
    roomId: string,
    addCommentDto: AddCommentDto,
    userId: string,
  ): Promise<void> {
    const { document, data, userIsCreator, userIsJoined } =
      await this.convertParams(roomId, userId);

    if (!userIsCreator() && !userIsJoined()) {
      throw new NotAcceptableException(
        'user must be creator or joined user to comment',
      );
    }

    const comments = data.comments;
    const comment: Comment = converter.fromFirestoreComment(
      addCommentDto,
      userId,
    );
    comments.push(comment);

    document.update({
      comments: comments,
    });
  }

  private async categoryExists(categoryId: string): Promise<boolean> {
    const categories = await this.categoriesService.getAllCategories();
    return categories.some((category) => category.id === categoryId);
  }

  private async convertParams(
    roomId: string,
    userId: string,
  ): Promise<ConvertedParams> {
    const document = this.firestore
      .collection(this.COLLECTION_NAME)
      .doc(roomId);

    const snapshot = await document.get();
    const data = snapshot.data();

    const userIsCreator = (): boolean => data.creatorUserId === userId;
    const userIsJoined = (): boolean => data.joinedUserIds.includes(userId);

    return {
      document,
      data,
      userIsCreator,
      userIsJoined,
    };
  }
}

interface ConvertedParams {
  document: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
  data: FirebaseFirestore.DocumentData;
  userIsCreator: () => boolean;
  userIsJoined: () => boolean;
}
