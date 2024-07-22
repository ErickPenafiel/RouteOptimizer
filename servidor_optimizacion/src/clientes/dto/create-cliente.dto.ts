import { IsString } from "class-validator";

export class CreateClienteDto {
  @IsString()
  nombre: string;
  @IsString()
  apellidos: string;
  @IsString()
  telefono: string;
  @IsString()
  email: string;
  @IsString()
  direccion: string;
}
