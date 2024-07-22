import { Pedido } from "./pedido.interface";

export interface Ruta {
  id?: number;
  id_ruta?: number;
  ruta_optimizada: [];
  pedidos: Pedido[];
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}