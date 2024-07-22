import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Column, ManyToOne } from "typeorm";
import { Conductor } from "../../conductores/entities/conductore.entity";
import { Ruta } from "../../rutas/entities/ruta.entity";
import { Vehiculo } from "../../vehiculo/entities/vehiculo.entity";

@Entity()
export class Entregas {
  @PrimaryGeneratedColumn()
  id_entrega: number;

  @OneToOne(() => Ruta, ruta => ruta.entrega)
  @JoinColumn()
  ruta: Ruta;

  @ManyToOne(() => Vehiculo, vehiculo => vehiculo.entregas)
  vehiculo: Vehiculo;

  @ManyToOne(() => Conductor, conductor => conductor.entregas)
  conductor: Conductor;

  @Column()
  fecha: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
