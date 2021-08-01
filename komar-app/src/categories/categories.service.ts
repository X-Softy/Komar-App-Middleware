import { Injectable } from '@nestjs/common';
import { FirebaseFactory } from 'src/utils/firebase.factory';
import { Category } from './category.model';

@Injectable()
export class CategoriesService {
  private firestore = FirebaseFactory.shared.app.firestore();

  async getAllCategories(): Promise<Category[]> {
    const categoriesDocs = await this.firestore.collection('categories').get();
    const categories: Category[] = [];
    categoriesDocs.forEach((categoryDoc) => {
      const category: Category = {
        id: categoryDoc.id,
        title: categoryDoc.data().title,
      };
      categories.push(category);
    });
    return categories;
  }
}
