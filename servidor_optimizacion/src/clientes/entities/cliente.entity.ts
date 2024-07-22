import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @Column()
  direccion: string;

  @OneToMany(() => Pedido, pedido => pedido.cliente)
  pedidos: Pedido[];
}
