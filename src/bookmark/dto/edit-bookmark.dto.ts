import { IsString } from 'class-validator';

export class EditBookmarkDTO {
  @IsString()
  title?: string;

  @IsString()
  link?: string;

  @IsString()
  description?: string;
}
