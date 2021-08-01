import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CategoriesService } from './categories.service';
import { Category } from './category.model';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }
}
