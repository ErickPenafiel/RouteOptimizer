import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from 'src/app/interfaces/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  constructor(
    private http: HttpClient
  ) { }

  getAllRutas() {
    return this.http.get('http://localhost:3000/rutas')
  }

  getRuta(id: number) {
    return this.http.get(`http://localhost:3000/rutas/${id}`)
  }

  optimizarRutas(ubicaciones: Pedido[]) {
    return this.http.post('http://localhost:3000/rutas/optimizar', { ubicaciones })
  }

  deleteRuta(id: number) {
    return this.http.delete(`http://localhost:3000/rutas/${id}`)
  }
}
