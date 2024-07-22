import { Module } from '@nestjs/common';
import { EntregasService } from './entregas.service';
import { EntregasController } from './entregas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from 'src/pedidos/entities/pedido.entity';
import { Conductor } from 'src/conductores/entities/conductore.entity';
import { Vehiculo } from 'src/vehiculo/entities/vehiculo.entity';
import { Entregas } from './entities/entregas.entity';
import { Ruta } from 'src/rutas/entities/ruta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entregas, Pedido, Ruta, Conductor, Vehiculo])],
  controllers: [EntregasController],
  providers: [EntregasService],
})
export class EntregasModule {}
