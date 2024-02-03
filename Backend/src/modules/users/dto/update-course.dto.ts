import { IsString, IsOptional } from 'class-validator';

export class UpdateCourseRequestDto {
  @IsOptional()
  @IsString()
  public fullName?: string;

  @IsOptional()
  @IsString()
  public shortName?: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public coverPicture?: string;

  @IsOptional()
  @IsString()
  public level?: string;

  @IsOptional()
  @IsString()
  public slug?: string;

  constructor(
    fullName?: string,
    shortName?: string,
    description?: string,
    coverPicture?: string,
    level?: string,
    slug?: string
  ) {
    this.fullName = fullName;
    this.shortName = shortName;
    this.description = description;
    this.coverPicture = coverPicture;
    this.level = level;
    this.slug = slug;
  }
}
