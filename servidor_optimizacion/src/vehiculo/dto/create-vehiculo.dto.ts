import { IsNumber, IsString } from "class-validator";

export class CreateVehiculoDto {
  @IsString()
  placa: string;

  @IsString()
  marca: string;

  @IsString()
  modelo: string;

  @IsNumber()
  anio: number;

  @IsNumber()
  capacidad_carga: number;
}
