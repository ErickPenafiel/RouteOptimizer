import { Cliente } from "src/clientes/entities/cliente.entity";
import { Ruta } from "src/rutas/entities/ruta.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @Column('double')
  latitud: number;

  @Column('double')
  longitud: number;

  @ManyToOne(() => Cliente, cliente => cliente.pedidos)
  cliente: Cliente;

  @ManyToOne(() => Ruta, (ruta) => ruta.pedidos)
  ruta: Ruta;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
