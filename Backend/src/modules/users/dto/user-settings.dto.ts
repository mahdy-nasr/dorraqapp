import { IsString, IsOptional } from 'class-validator';

export class UpdateUserRequestDto {
  @IsOptional()
  @IsString()
  public firstName?: string;

  @IsOptional()
  @IsString()
  public lastName?: string;

  @IsOptional()
  @IsString()
  public country?: string;

  @IsOptional()
  @IsString()
  public city?: string;

  @IsOptional()
  @IsString()
  public university?: string;

  @IsOptional()
  @IsString()
  public education?: string;

  @IsOptional()
  @IsString()
  public phone?: string;

  @IsOptional()
  @IsString()
  public language?: string;

  @IsOptional()
  @IsString()
  public gender?: string;

  @IsOptional()
  @IsString()
  public profilePicture?: string;

  constructor(
    firstName?: string,
    lastName?: string,
    country?: string,
    city?: string,
    university?: string,
    education?: string,
    phone?: string,
    language?: string,
    gender?: string,
    profilePicture?: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.country = country;
    this.city = city;
    this.university = university;
    this.education = education;
    this.phone = phone;
    this.language = language;
    this.gender = gender;
    this.profilePicture = profilePicture;
  }
}
