import { Injectable } from '@nestjs/common';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { UpdateAdministradorDto } from './dto/update-administrador.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrador } from './entities/administrador.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdministradorService {

  constructor(
    @InjectRepository(Administrador)
    private administradorRepository: Repository<Administrador>,
  ) { }

  async create(createAdministradorDto: CreateAdministradorDto) {
    const { nombre, apellido, email, password } = createAdministradorDto;

    const administrador = await this.administradorRepository.create({
      nombre,
      apellido,
      email,
      password
    });

    await this.administradorRepository.save(administrador);

    return {
      message: 'Administrador creado exitosamente',
      data: administrador
    };
  }

  async findAll() {
    return this.administradorRepository.find({where: {deleted_at: null}});
  }

  async findOne(id: number) {
    return this.administradorRepository.findOne({where: {id, deleted_at: null}});
  }

  async update(id: number, updateAdministradorDto: UpdateAdministradorDto) {
    const { nombre, apellido, email, password } = updateAdministradorDto;

    const administrador = await this.administradorRepository.findOne({where: {id, deleted_at: null}});
    administrador.nombre = nombre;
    administrador.apellido = apellido;
    administrador.email = email;
    administrador.password = password;

    await this.administradorRepository.save(administrador);

    return {
      message: 'Administrador actualizado exitosamente',
      data: administrador
    };
  }

  async remove(id: number) {
    const administrador = await this.administradorRepository.findOne({where: {id, deleted_at: null}});
    await this.administradorRepository.softRemove(administrador);

    return {
      message: 'Administrador eliminado exitosamente',
      data: administrador
    };
  }

  async login(email: string, password: string) {
    const administrador = await this.administradorRepository.findOne({where: {email, password, deleted_at: null}});

    if (!administrador) {
      return {
        message: 'Credenciales inválidas',
        data: false
      };
    }

    return {
      message: 'Inicio de sesión exitoso',
      data: true
    };
  }
}
