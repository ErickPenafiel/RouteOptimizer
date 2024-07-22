import { IsString } from "class-validator";

export class CreateAdministradorDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
