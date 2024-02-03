import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateLessonRequestDto {
  @IsOptional()
  @IsString()
  public lessonTitle?: string;

  @IsOptional()
  @IsNumber()
  public lessonNumber?: number;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public tag?: string;

  constructor(
    lessonTitle?: string,
    lessonNumber?: number,
    description?: string,
    tag?: string
  ) {
    this.lessonTitle = lessonTitle;
    this.lessonNumber = lessonNumber;
    this.description = description;
    this.tag = tag;
  }
}
