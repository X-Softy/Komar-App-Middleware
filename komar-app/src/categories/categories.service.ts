import { Injectable } from '@nestjs/common';
import { FirebaseFactory } from 'src/utils/firebase.factory';
import { Category, converter } from './category.model';

@Injectable()
export class CategoriesService {
  private firestore = FirebaseFactory.shared.app.firestore();
  private readonly COLLECTION_NAME = 'categories';

  async getAllCategories(): Promise<Category[]> {
    const categoriesDocs = await this.firestore
      .collection(this.COLLECTION_NAME)
      .get();
    return converter.fromFirestoreList(categoriesDocs);
  }
}
