import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { Pedido } from 'src/app/interfaces/pedido.interface';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  constructor(
    private http: HttpClient,
    private dialog: DialogService,
  ) { }

  getAllPedidos() {
    return this.http.get<Pedido[]>('http://localhost:3000/pedidos')
  }

  getAllPedidosAsignar() {
    return this.http.get<Pedido[]>('http://localhost:3000/pedidos/asignar')
  }

  getPedido(id: number) {
    return this.http.get<Pedido>(`http://localhost:3000/pedidos/${id}`)
  }

  createPedido(pedido: Pedido) {
    return this.http.post<Pedido>('http://localhost:3000/pedidos', pedido)
  }

  updatePedido(id: number, pedido: Pedido) {
    return this.http.patch<Pedido>(`http://localhost:3000/pedidos/${id}`, pedido)
  }

  deletePedido(id: number) {
    const data = {
      title: 'Confirmar eliminación de pedido',
      mensaje: '¿Está seguro de que desea eliminar este pedido?',
      color: 'warn',
      nameButton: 'Eliminar',
    };
    const dialogRef = this.dialog.openConfirmationDialog(data);
    return dialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (result) {
          return this.http.delete(`http://localhost:3000/pedidos/${id}`);
        }
        return of([]);
      })
    );
  }
}
