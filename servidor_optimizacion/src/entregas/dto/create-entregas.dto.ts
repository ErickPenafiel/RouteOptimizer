import { IsNotEmpty, IsNumber } from "class-validator";


export class CreateEntregasDto {
  @IsNotEmpty()
  @IsNumber()
  id_ruta: number;

  @IsNotEmpty()
  @IsNumber()  
  id_vehiculo: number;

  @IsNotEmpty()
  @IsNumber()
  id_conductor: number;
}
