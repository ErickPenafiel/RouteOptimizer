import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePedidoDto {

  @IsNotEmpty()
  latitud: number;

  @IsNotEmpty()
  longitud: number;

  @IsNotEmpty()
  @IsNumber()
  clienteIdCliente: number;
}
