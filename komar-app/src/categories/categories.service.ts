import { Injectable } from '@nestjs/common';
import { Category } from './category.model';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    {
      identifier: 0,
      title: 'Category 0',
    },
    {
      identifier: 1,
      title: 'Category 1',
    },
  ];

  getAllCategories(): Category[] {
    return this.categories;
  }
}
