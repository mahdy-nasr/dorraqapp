import { IsString } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
