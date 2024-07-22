import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { Entrega } from 'src/app/interfaces/entregas.interface';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {
  constructor(
    private http: HttpClient,
    private dialog: DialogService,
  ) { }

  getAllEntregas() {
    return this.http.get<Entrega[]>('http://localhost:3000/entregas')
  }

  getEntrega(id: number) {
    return this.http.get<Entrega>(`http://localhost:3000/entregas/${id}`)
  }

  createEntrega(entrega: Entrega) {
    return this.http.post<Entrega>('http://localhost:3000/entregas', entrega)
  }

  updateEntrega(id: number, entrega: Entrega) {
    return this.http.patch<Entrega>(`http://localhost:3000/entregas/${id}`, entrega)
  }

  deleteEntrega(id: number) {
    const data = {
      title: 'Confirmar eliminación de la entrega',
      mensaje: '¿Está seguro de que desea eliminar esta entrega?',
      color: 'warn',
      nameButton: 'Eliminar',
    };
    const dialogRef = this.dialog.openConfirmationDialog(data);
    return dialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (result) {
          return this.http.delete(`http://localhost:3000/entregas/${id}`);
        }
        return of([]);
      })
    );
  }
}
