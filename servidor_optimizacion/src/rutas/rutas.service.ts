import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ruta } from './entities/ruta.entity';
import { IsNull, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

@Injectable()
export class RutasService {
  private apiUrlMapbox = process.env.API_URL_MAPBOX_RUTAS;

  constructor(
    @InjectRepository(Ruta)
    private readonly rutaRepository: Repository<Ruta>,
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    private readonly http: HttpService
  ) {}

  async findAll(): Promise<Ruta[]> {
    return await this.rutaRepository.find({relations: ['pedidos']});
  }

  async findAllRutas() {
    return await this.rutaRepository.find({
      where: { deleted_at: IsNull(), entrega: IsNull() },
      relations: ['entrega', 'pedidos']
    });
  }

  async findOne(id: number): Promise<Ruta> {
    return await this.rutaRepository.findOne({ where: { id_ruta: id }, relations: ['pedidos'] });
  }

  async optimizarRuta(pedidos: Pedido[]): Promise<any> {
    if (!Array.isArray(pedidos)) {
      throw new Error('Debe ser un arreglo de objetos con latitud y longitud');
    }
    const puntoInicial = {      
      id_pedido: null,
      latitud: -19.03893489509178,
      longitud: -65.24435258870824,
      cliente: null,
      ruta: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }

    pedidos.unshift(puntoInicial);

    const pedidosOrdenados = this.ordenarPorDistancia(pedidos);

    const url = [
      this.apiUrlMapbox,
      pedidosOrdenados.map(ubicacion => `${ubicacion.longitud},${ubicacion.latitud}`).join(';'),
      `?steps=true&geometries=geojson&access_token=${process.env.API_KEY_MAPBOX}`
    ].join('');

    console.log(url);

    const data = await this.http.get(url)
      .pipe(
        map(response => response.data)
      )
      .toPromise();

    const {routes} = data
    const rutaOptima = routes[0].geometry.coordinates;

    const newRoute = await this.rutaRepository.create({
      ruta_optimizada: rutaOptima
    });

    const resultAdd = await this.rutaRepository.save(newRoute);

    console.log("Ruta optimizada: ", resultAdd);

    pedidos.forEach(async pedido => {
      const pedidoToUpdate = await this.pedidoRepository.findOne({where: {id_pedido: pedido.id_pedido}});
      pedidoToUpdate.ruta = resultAdd;
      await this.pedidoRepository.save(pedidoToUpdate);
    })

    return {
      message: 'Ruta optimizada',
      data: resultAdd
    }
  }

  private calcularDistancia(pedido1: Pedido, pedido2: Pedido): number {
    // Fórmula de distancia euclidiana
    const lat1 = pedido1.latitud;
    const lon1 = pedido1.longitud;
    const lat2 = pedido2.latitud;
    const lon2 = pedido2.longitud;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = 6371 * c; // Radio de la Tierra en kilómetros
    return d;
  }

  private ordenarPorDistancia(pedidos: Pedido[]): Pedido[] {
    const puntos = pedidos.slice(); // Copia superficial de los pedidos

    const primerPunto = puntos.shift(); // Sacar el primer punto

    const rutaOrdenada = [primerPunto]; // Inicializar la ruta ordenada con el primer punto

    let puntoActual = primerPunto;

    while (puntos.length > 0) {
      let distanciaMinima = Infinity;
      let puntoMasCercano = null;

      puntos.forEach(punto => {
        const distancia = this.calcularDistancia(puntoActual, punto);
        if (distancia < distanciaMinima) {
          distanciaMinima = distancia;
          puntoMasCercano = punto;
        }
      });

      rutaOrdenada.push(puntoMasCercano);
      puntoActual = puntoMasCercano;

      // Remover el punto añadido de la lista de puntos
      puntos.splice(puntos.indexOf(puntoMasCercano), 1);
    }

    return rutaOrdenada;
  }

  async remove(id: number): Promise<any> {
    const ruta = await this.rutaRepository.findOne({ where: { id_ruta: id, deleted_at: IsNull() } });

    if (!ruta) {
      throw new Error('Ruta no encontrada');
    }

    await this.rutaRepository.softRemove(ruta);

    return {
      message: 'Ruta eliminada con exito'
    }
  }
}
