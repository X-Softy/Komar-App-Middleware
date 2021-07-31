import { Injectable } from '@nestjs/common';
import { Category } from './category.model';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    {
      id: '0',
      title: 'Category 0',
    },
    {
      id: '1',
      title: 'Category 1',
    },
  ];

  getAllCategories(): Category[] {
    return this.categories;
  }
}
