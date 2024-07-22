import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { ConductoresModule } from './conductores/conductores.module';
import { ClientesModule } from './clientes/clientes.module';
import { RutasModule } from './rutas/rutas.module';
import { EntregasModule } from './entregas/entregas.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PedidosModule } from './pedidos/pedidos.module';
import { WebsocketModule } from './websocket/websocket.module';
import { AdministradorModule } from './administrador/administrador.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'server_optimizacion',
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      synchronize: true,
    }),
    VehiculoModule,
    ConductoresModule,
    ClientesModule,
    RutasModule,
    EntregasModule,
    HttpModule,
    PedidosModule,
    WebsocketModule,
    AdministradorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
