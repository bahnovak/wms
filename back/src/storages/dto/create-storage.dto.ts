import { IsNotEmpty } from 'class-validator';

export class CreateStorageDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  floor: number;

  @IsNotEmpty()
  room: string;
}
