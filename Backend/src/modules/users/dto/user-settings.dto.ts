import { IsString } from 'class-validator';

export class UpdateUserRequestDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public country: string;

  @IsString()
  public city: string;

  @IsString()
  public university: string;

  @IsString()
  public education: string;

  @IsString()
  public phone: string;

  @IsString()
  public language: string;

  @IsString()
  public profilePicture: string;

  @IsString()
  public gender: string;

  constructor(
    firstName: string,
    lastName: string,
    country: string,
    city: string,
    university: string,
    education: string,
    phone: string,
    language: string,
    profilePicture: string,
    gender: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.country = country;
    this.city = city;
    this.university = university;
    this.education = education;
    this.phone = phone;
    this.language = language;
    this.profilePicture = profilePicture;
    this.gender = gender;
  }
}
