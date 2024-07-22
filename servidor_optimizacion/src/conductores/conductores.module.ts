import { Module } from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { ConductoresController } from './conductores.controller';
import { Conductor } from './entities/conductore.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conductor]),
  ],
  controllers: [ConductoresController],
  providers: [ConductoresService],
})
export class ConductoresModule {}
