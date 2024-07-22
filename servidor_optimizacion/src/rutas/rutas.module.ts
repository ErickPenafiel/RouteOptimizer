import { Module } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { RutasController } from './rutas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ruta } from './entities/ruta.entity';
import { HttpModule } from '@nestjs/axios';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ruta, Pedido]), HttpModule],
  controllers: [RutasController],
  providers: [RutasService],
})
export class RutasModule {}
