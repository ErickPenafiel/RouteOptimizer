import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const { nombre, apellidos, email, telefono, direccion } = createClienteDto;

    const cliente = await this.clienteRepository.create({
      nombre,
      apellidos,
      email,
      telefono,
      direccion
    });

    try {
      await this.clienteRepository.save(cliente);
    } catch (error) {
      throw new Error('Error al guardar el cliente');
    }

    return {
      message: 'Cliente creado con exito',
      data: cliente
    }
  }

  async findAll() {
    return await this.clienteRepository.find();
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({ where: { id_cliente: id } });

    if(!cliente) {
      throw new Error('Cliente no encontrado');
    }

    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.findOne({ where: { id_cliente: id } });

    if(!cliente) {
      throw new Error('Cliente no encontrado');
    }

    const { nombre, apellidos, email, telefono, direccion } = updateClienteDto;

    cliente.nombre = nombre;
    cliente.apellidos = apellidos;
    cliente.email = email;
    cliente.telefono = telefono;
    cliente.direccion = direccion;

    try {
      await this.clienteRepository.save(cliente);
    } catch (error) {
      throw new Error('Error al actualizar el cliente');
    }

    return {
      message: 'Cliente actualizado con exito',
      data: cliente
    }
  }

  async remove(id: number) {
    const cliente = await this.clienteRepository.findOne({ where: { id_cliente: id } });

    if(!cliente) {
      throw new Error('Cliente no encontrado');
    }

    try {
      await this.clienteRepository.remove(cliente);
    } catch (error) {
      throw new Error('Error al eliminar el cliente');
    }

    return {
      message: 'Cliente eliminado con exito',
      data: cliente
    }
  }
}
