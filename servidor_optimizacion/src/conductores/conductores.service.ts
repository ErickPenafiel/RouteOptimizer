import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConductoreDto } from './dto/create-conductore.dto';
import { UpdateConductoreDto } from './dto/update-conductore.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Conductor } from './entities/conductore.entity';


@Injectable()
export class ConductoresService {
  constructor(
    @InjectRepository(Conductor)
    private conductoresRepository: Repository<Conductor>,
  ) {}

  async create(createConductoreDto: CreateConductoreDto) {
    const { nombre, apellido, ci, licencia, direccion, telefono } = createConductoreDto;

    const conductor = this.conductoresRepository.create({
      nombre,
      apellido,
      ci,
      licencia,
      direccion,
      telefono
    });

    try {
      await this.conductoresRepository.save(conductor);
    } catch(error) {
      throw new BadRequestException('Error al guardar el conductor');
    }

    return {
      message: 'Conductor creado con exito',
      data: conductor
    }
  }

  async findAll() {
    return this.conductoresRepository.find();
  }

  async findOne(id: number) {
    const conductor = await this.conductoresRepository.findOne({ where: { id_conductor: id } });

    if(!conductor) {
      throw new BadRequestException('Conductor no encontrado');
    }

    return conductor;
  }

  async update(id: number, updateConductoreDto: UpdateConductoreDto) {
    const { nombre, apellido, ci, licencia, direccion, telefono } = updateConductoreDto;

    const conductor = await this.conductoresRepository.findOne({ where: {id_conductor: id} });

    if(!conductor) {
      throw new BadRequestException('conductor no encontrado');
    }

    conductor.nombre = nombre;
    conductor.apellido = apellido;
    conductor.ci = ci;
    conductor.licencia = licencia;
    conductor.direccion = direccion;
    conductor.telefono = telefono;

    const conductorUpdated = await this.conductoresRepository.save(conductor);

    return {
      message: 'Conductor actualizado con exito',
      data: conductorUpdated
    }
  }

  async remove(id: number) {
    const conductor = await this.conductoresRepository.findOne({ where: { id_conductor: id } });

    if(!conductor) {
      throw new BadRequestException('Conductor no encontrado');
    }

    await this.conductoresRepository.remove(conductor);

    return {
      message: 'Conductor eliminado con exito'
    }
  }

  async login(ci: string, password: string) {
    const conductor = await this.conductoresRepository.findOne({ where: { ci } });

    if(!conductor) {
      throw new BadRequestException('Conductor no encontrado');
    }

    if(conductor.password !== password) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    return {
      message: 'Conductor logueado con exito',
      data: conductor
    }
  }
}
