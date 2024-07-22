import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  // @Post()
  // create(@Body() createRutaDto: CreateRutaDto) {
  //   return this.rutasService.create(createRutaDto);
  // }

  @Get()
  findAll() {
    return this.rutasService.findAll();
  }

  @Get('asignar')
  findAllRutas() {
    return this.rutasService.findAllRutas();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutasService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRutaDto: UpdateRutaDto) {
  //   return this.rutasService.update(+id, updateRutaDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutasService.remove(+id);
  }

  @Post('optimizar')
  optimizarRuta(@Body() body: any) {
    const ubicaciones: Pedido[] = body.ubicaciones;
    return this.rutasService.optimizarRuta(ubicaciones);
  }
}
