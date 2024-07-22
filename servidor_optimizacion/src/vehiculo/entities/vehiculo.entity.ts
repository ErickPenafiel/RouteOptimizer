import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Entregas } from "../../entregas/entities/entregas.entity";

@Entity()
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id_vehiculo: number;

  @Column()
  placa: string;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column()
  anio: number;

  @Column()
  capacidad_carga: number;

  @OneToMany(() => Entregas, entrega => entrega.vehiculo)
  entregas: Entregas[];
}
