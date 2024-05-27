import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateStorageDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  floor: number;

  @IsNotEmpty()
  room: string;
}
