import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Entregas } from "../../entregas/entities/entregas.entity";
import { Pedido } from "src/pedidos/entities/pedido.entity";

@Entity()
export class Ruta {
  @PrimaryGeneratedColumn()
  id_ruta: number;

  @Column('json')
  ruta_optimizada: any[];

  @OneToOne(() => Entregas, entrega => entrega.ruta)
  @JoinColumn()
  entrega: Entregas;

  @OneToMany(() => Pedido, (pedido) => pedido.ruta)
  pedidos: Pedido[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
