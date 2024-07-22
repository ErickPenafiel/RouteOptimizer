import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  constructor(
    private http: HttpClient,
    private dialog: DialogService,
  ) { }

  getAllClientes() {
    return this.http.get<Cliente[]>('http://localhost:3000/clientes')
  }

  getCliente(id: number) {
    return this.http.get<Cliente>(`http://localhost:3000/clientes/${id}`)
  }

  createCliente(cliente: Cliente) {
    return this.http.post<Cliente>('http://localhost:3000/clientes', cliente)
  }

  updateCliente(id: number, cliente: Cliente) {
    return this.http.patch<Cliente>(`http://localhost:3000/clientes/${id}`, cliente)
  }

  deleteCliente(id: number) {
    const data = {
      title: 'Confirmar eliminación de cliente',
      mensaje: '¿Está seguro de que desea eliminar este cliente?',
      color: 'warn',
      nameButton: 'Eliminar',
    };
    const dialogRef = this.dialog.openConfirmationDialog(data);
    return dialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (result) {
          return this.http.delete(`http://localhost:3000/clientes/${id}`);
        }
        return of([]);
      })
    );
  }
}
