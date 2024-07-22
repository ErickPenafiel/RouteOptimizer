import { Conductor } from "./conductor.interface";
import { Ruta } from "./ruta.interface";
import { Vehiculo } from "./vehiculo.interface";

export interface Entrega {
  id?: number;
  id_entrega?: number;
  id_ruta?: number;
  ruta?: Ruta;
  id_conductor?: number;
  conductor?: Conductor;
  id_vehiculo?: number;
  vehiculo?: Vehiculo;
}