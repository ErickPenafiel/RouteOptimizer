import { Cliente } from "./cliente.interface";

export interface Pedido {
  id?: number;
  id_pedido?: number;
  latitud: number;
  longitud: number;
  clienteIdCliente?: number;
  cliente?: Cliente
}