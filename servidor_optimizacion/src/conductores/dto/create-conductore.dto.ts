import { IsNumber, IsString } from "class-validator";

export class CreateConductoreDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  ci: string;

  @IsString()
  licencia: string;

  @IsString()
  direccion: string;

  @IsNumber()
  telefono: number;  
}
