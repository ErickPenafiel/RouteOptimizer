import { Injectable } from '@nestjs/common';
import { CreateEntregasDto } from './dto/create-entregas.dto';
import { UpdateEntregasDto } from './dto/update-entregas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entregas } from './entities/entregas.entity';
import { Repository } from 'typeorm';
import { Ruta } from 'src/rutas/entities/ruta.entity';
import { Conductor } from 'src/conductores/entities/conductore.entity';
import { Vehiculo } from 'src/vehiculo/entities/vehiculo.entity';

@Injectable()
export class EntregasService {

  constructor(
    @InjectRepository(Entregas)
    private readonly entregasRepository: Repository<Entregas>,
    @InjectRepository(Ruta)
    private readonly rutasRepository: Repository<Ruta>,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Conductor)
    private readonly conductoresRepository: Repository<Conductor>
  ) {}

  async create(createEntregasDto: CreateEntregasDto) {
    const { id_ruta, id_vehiculo, id_conductor } = createEntregasDto;

    const ruta = await this.rutasRepository.findOne({where: {id_ruta}});
    if(!ruta) {
      throw new Error('Ruta no encontrada');
    }

    const vehiculo = await this.vehiculoRepository.findOne({where: {id_vehiculo}});
    if(!vehiculo) {
      throw new Error('Vehiculo no encontrado');
    }

    const conductor = await this.conductoresRepository.findOne({where: {id_conductor}});
    if(!conductor) {
      throw new Error('Conductor no encontrado');
    }

    const entrega = await this.entregasRepository.create({
      ruta: ruta,
      vehiculo: vehiculo,
      conductor: conductor,
      fecha: new Date()      
    });

    console.log(entrega);

    await this.entregasRepository.save(entrega);

    return {
      message: 'Entrega creada con exito',
      data: entrega
    }
  }

  async findAll() {
    return await this.entregasRepository.find({
      where: {deleted_at: null},
      relations: ['ruta', 'vehiculo', 'conductor']
    });
  }

  async findOne(id: number) {
    return await this.entregasRepository.findOne({
      where: {id_entrega: id, deleted_at: null},
      relations: ['ruta', 'vehiculo', 'conductor']
    });
  }

  async update(id: number, updateEntregasDto: UpdateEntregasDto) {
    const { id_ruta, id_vehiculo, id_conductor } = updateEntregasDto;

    const entrega = await this.entregasRepository.findOne({
      where: {id_entrega: id, deleted_at: null}
    });

    if(!entrega) {
      throw new Error('Entrega no encontrada');
    }

    const ruta = await this.rutasRepository.findOne({where: {id_ruta}});
    if(!ruta) {
      throw new Error('Ruta no encontrada');
    }

    const vehiculo = await this.vehiculoRepository.findOne({where: {id_vehiculo}});
    if(!vehiculo) {
      throw new Error('Vehiculo no encontrado');
    }

    const conductor = await this.conductoresRepository.findOne({where: {id_conductor}});
    if(!conductor) {
      throw new Error('Conductor no encontrado');
    }

    entrega.ruta = ruta;
    entrega.vehiculo = vehiculo;
    entrega.conductor = conductor;

    await this.entregasRepository.save(entrega);

    return {
      message: 'Entrega actualizada con exito',
      data: entrega
    }
  }

  async remove(id: number) {
    const entrega = await this.entregasRepository.findOne({
      where: {id_entrega: id, deleted_at: null}
    });

    if(!entrega) {
      throw new Error('Entrega no encontrada');
    }

    await this.entregasRepository.softRemove(entrega);

    return {
      message: 'Entrega eliminada con exito',
      data: entrega
    }
  }

  async getEntregaByConductor(conductor_id: number) {
    const conductor = await this.conductoresRepository.findOne({where: {id_conductor: conductor_id}});

    console.log(conductor);

    if(!conductor) {
      throw new Error('Conductor no encontrado');
    }

    console.log( await this.entregasRepository.find({
      where: {conductor: conductor, deleted_at: null},
      relations: ['ruta', 'vehiculo', 'conductor']
    }));

    return await this.entregasRepository.find({
      where: {conductor: conductor, deleted_at: null},
      relations: ['ruta', 'vehiculo', 'conductor']
    });
  }
}
