import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Entregas } from "../../entregas/entities/entregas.entity";

@Entity()
export class Conductor {
  @PrimaryGeneratedColumn()
  id_conductor: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  ci: string;

  @Column()
  password: string;

  @Column()
  licencia: string;

  @Column()
  telefono: number;

  @Column()
  direccion: string;

  @OneToMany(() => Entregas, entrega => entrega.conductor)
  entregas: Entregas[]; 
}
