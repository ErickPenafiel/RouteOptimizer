import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { IsNull, Repository } from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Injectable()
export class PedidosService {
  
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const {latitud, longitud, clienteIdCliente } = createPedidoDto;

    const cliente = await this.clienteRepository.findOne({ where: { id_cliente: clienteIdCliente } });

    if(!cliente) {
      throw new Error('Cliente no encontrado');
    }

    const pedido = await this.pedidoRepository.create({
      latitud,
      longitud,
      cliente
    });

    try {
      await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new Error('Error al guardar el pedido');
    }

    return {
      message: 'Pedido creado con exito',
      data: pedido
    }
  }

  async findAll() {
    return await this.pedidoRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['cliente', 'ruta'] 
    });
  }

  async findAllPedidos() {
    return await this.pedidoRepository.find({
      where: { deleted_at: IsNull(), ruta: IsNull() },
      relations: ['cliente', 'ruta']
    })
  }

  async findOne(id: number) {
    const pedido = await this.pedidoRepository.findOne({ where: { id_pedido: id }, relations: ['cliente']});

    if(!pedido) {
      throw new Error('Pedido no encontrado');
    }

    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.pedidoRepository.findOne({ where: { id_pedido: id } });

    if(!pedido) {
      throw new Error('Pedido no encontrado');
    }

    const { latitud, longitud, clienteIdCliente } = updatePedidoDto;
    const cliente = await this.clienteRepository.findOne({ where: { id_cliente: clienteIdCliente } });

    pedido.cliente = cliente;
    pedido.latitud = latitud;
    pedido.longitud = longitud;

    try {
      await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new Error('Error al actualizar el pedido');
    }

    return {
      message: 'Pedido actualizado con exito',
      data: pedido
    }
  }

  async remove(id: number) {
    const pedido = await this.pedidoRepository.findOne({ where: { id_pedido: id }, relations: ['cliente'] });

    if(!pedido) {
      throw new Error('Pedido no encontrado');
    }

    try {
      await this.pedidoRepository.remove(pedido);
    } catch (error) {
      throw new Error('Error al eliminar el pedido');
    }

    return {
      message: 'Pedido eliminado con exito',
      data: pedido
    }
  }
}
