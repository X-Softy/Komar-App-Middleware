import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
