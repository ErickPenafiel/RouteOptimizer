import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private vehiculoRepository: Repository<Vehiculo>,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto) {
    const { placa, marca, modelo, anio, capacidad_carga } = createVehiculoDto;

    const vehiculo = await this.vehiculoRepository.create({
      placa,
      marca,
      modelo,
      anio,
      capacidad_carga
    });

    try {
      await this.vehiculoRepository.save(vehiculo);
    } catch (error) {
      throw new BadRequestException('Error al guardar el vehiculo');
    }

    return {
      message: 'Vehiculo creado con exito',
      data: vehiculo
    }
  }

  async findAll() {
    return await this.vehiculoRepository.find();
  }

  async findOne(id: number) {
    const vehiculo = await this.vehiculoRepository.findOne({ where: { id_vehiculo: id } });

    if(!vehiculo) {
      throw new BadRequestException('Vehiculo no encontrado');
    }

    return vehiculo
  }

  async update(id: number, updateVehiculoDto: UpdateVehiculoDto) {
    const { placa, marca, modelo, anio, capacidad_carga } = updateVehiculoDto;

    const vehiculo = await this.vehiculoRepository.findOne({ where: {id_vehiculo: id} });

    if(!vehiculo) {
      throw new BadRequestException('Vehiculo no encontrado');
    }

    vehiculo.placa = placa;
    vehiculo.marca = marca;
    vehiculo.modelo = modelo;
    vehiculo.anio = anio;
    vehiculo.capacidad_carga = capacidad_carga;

    const vehiculoUpdated = await this.vehiculoRepository.save(vehiculo);

    return {
      message: 'Vehiculo actualizado con exito',
      data: vehiculoUpdated
    }
  }

  async remove(id: number) {
    const vehiculo = await this.vehiculoRepository.findOne({ where: { id_vehiculo: id } });

    if(!vehiculo) {
      throw new BadRequestException('Vehiculo no encontrado');
    }

    await this.vehiculoRepository.remove(vehiculo);

    return {
      message: 'Vehiculo eliminado con exito',
      data: vehiculo
    }
  }
}
